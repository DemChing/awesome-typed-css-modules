import camelcase from "camelcase";
import { paramCase } from "param-case";

import { CorePluginsType, sourceToClassNames } from "./source-to-class-names";
import {
  Implementations,
  getImplementation,
  Preprocessors,
  getPreprocessor,
} from "../implementations";
import { customImporters, Aliases, SASSImporterOptions } from "./importer";
import { ParsersType, PostCSSVersion } from "../typescript";

export type ClassName = string;
export type ClassNames = ClassName[];

export type NameFormat = "camel" | "kebab" | "param" | "dashes" | "none";

export interface SASSOptions extends SASSImporterOptions {
  additionalData?: string;
  includePaths?: string[];
  nameFormat?: NameFormat;
  plugins?: CorePluginsType;
  parsers?: ParsersType;
  postcss?: PostCSSVersion;
  implementation: Implementations;
}

export const NAME_FORMATS: NameFormat[] = [
  "camel",
  "kebab",
  "param",
  "dashes",
  "none",
];

export const nameFormatDefault: NameFormat = "camel";

export { Aliases };

export const fileToClassNames = (
  file: string,
  {
    additionalData,
    includePaths = [],
    nameFormat = "camel",
    implementation,
    aliases,
    aliasPrefixes,
    importer,
    plugins,
    postcss,
    parsers,
  }: SASSOptions = {} as SASSOptions
) => {
  const transformer = classNameTransformer(nameFormat);
  let preprocessor: Preprocessors = getPreprocessor(file, implementation);
  const { render } = getImplementation(preprocessor);

  return new Promise<ClassNames>(async (resolve, reject) => {
    try {
      const result = await render(
        {
          file,
          additionalData,
          includePaths,
          importer: customImporters({ aliases, aliasPrefixes, importer }),
        },
        parsers
      );

      sourceToClassNames(result, file, postcss, plugins)
        .then(({ exportTokens }) => {
          const classNames = Object.keys(exportTokens);
          const transformedClassNames = classNames
            .map(transformer)
            .sort((a, b) => a.localeCompare(b));

          resolve(transformedClassNames);
        })
        .catch(reject);
    } catch (err) {
      reject(err);
      return;
    }
  });
};

interface Transformer {
  (className: string): string;
}

const classNameTransformer = (nameFormat: NameFormat): Transformer => {
  switch (nameFormat) {
    case "kebab":
    case "param":
      return (className) => paramCase(className);
    case "camel":
      return (className) => camelcase(className);
    case "dashes":
      return (className) =>
        /-/.test(className) ? camelcase(className) : className;
    case "none":
      return (className) => className;
  }
};
