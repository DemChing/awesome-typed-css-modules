import os from "os";

import reserved from "reserved-words";

import { ClassNames, ClassName } from "lib/sass/file-to-class-names";
import { alerts } from "../core";
import { attemptPrettier } from "../prettier";

export type ExportType = "named" | "default";
export const EXPORT_TYPES: ExportType[] = ["named", "default"];

export type QuoteType = "single" | "double";
export const QUOTE_TYPES: QuoteType[] = ["single", "double"];

export type PostCSSVersion = "v6" | "v8";
export const POST_CSS_VERSIONS: PostCSSVersion[] = ["v6", "v8"];

export type ParsersType = {
  [type: string]: (src: string) => string;
};

export interface TypeDefinitionOptions {
  banner: string;
  classNames: ClassNames;
  exportType: ExportType;
  exportTypeName?: string;
  exportTypeInterface?: string;
  quoteType?: QuoteType;
  crlf?: boolean;
}

export const exportTypeDefault: ExportType = "named";
export const exportTypeNameDefault: string = "ClassNames";
export const exportTypeInterfaceDefault: string = "Styles";
export const quoteTypeDefault: QuoteType = "single";
export const bannerTypeDefault: string = "";

const classNameToNamedTypeDefinition = (className: ClassName) =>
  `export const ${className}: string;`;

const classNameToType = (className: ClassName, quoteType: QuoteType) => {
  const quote = quoteType === "single" ? "'" : '"';
  return `  ${quote}${className}${quote}: string;`;
};

const isReservedKeyword = (className: ClassName) =>
  reserved.check(className, "es5", true) ||
  reserved.check(className, "es6", true);

const isValidName = (className: ClassName) => {
  if (isReservedKeyword(className)) {
    alerts.warn(
      `[SKIPPING] '${className}' is a reserved keyword (consider renaming or using --exportType default).`
    );
    return false;
  } else if (/-/.test(className)) {
    alerts.warn(
      `[SKIPPING] '${className}' contains dashes (consider using 'camelCase' or 'dashes' for --nameFormat or using --exportType default).`
    );
    return false;
  }

  return true;
};

export const typeDefinitionIgnoreEOLSort = (typeDefinition: string | null) => {
  if (!typeDefinition) return [];
  return typeDefinition.split(/[\r\n]+/).sort();
};

export const classNamesToTypeDefinitions = async (
  options: TypeDefinitionOptions
): Promise<string | null> => {
  if (options.classNames.length) {
    const lines: string[] = [];
    let eol = os.EOL;
    if (typeof options.crlf !== "undefined") {
      eol = options.crlf ? "\r\n" : "\n";
    }

    const {
      exportTypeName: ClassNames = exportTypeNameDefault,
      exportTypeInterface: Styles = exportTypeInterfaceDefault,
    } = options;

    switch (options.exportType) {
      case "default":
        if (options.banner) lines.push(options.banner);

        lines.push(`export type ${Styles} = {`);
        lines.push(
          ...options.classNames.map((className) =>
            classNameToType(className, options.quoteType || quoteTypeDefault)
          )
        );
        lines.push(`};${eol}`);

        lines.push(`export type ${ClassNames} = keyof ${Styles};${eol}`);
        lines.push(`declare const styles: ${Styles};${eol}`);
        lines.push(`export default styles;`);

        break;
      case "named":
        if (options.banner) lines.push(options.banner);

        lines.push(
          ...options.classNames
            .filter(isValidName)
            .map(classNameToNamedTypeDefinition)
        );

        break;
    }

    if (lines.length) {
      const typeDefinition = lines.join(eol) + eol;
      return await attemptPrettier(typeDefinition);
    } else {
      return null;
    }
  } else {
    return null;
  }
};
