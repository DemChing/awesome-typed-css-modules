import nodeSass from "node-sass";
import sass from "sass";
import less from "less";
import stylus from "stylus";
import { ParsersType } from "../typescript";
import {
  NodeSassImporter,
  RenderOptions,
  migrateLegacyImporter,
  DartSassLegacyImporter,
  readFileData,
} from "../sass/importer";

/**
 * A list of all possible SASS package implementations that can be used to
 * perform the compilation and parsing of the SASS files. The expectation is
 * that they provide a nearly identical API so they can be swapped out but
 * all of the same logic can be reused.
 */
export const IMPLEMENTATIONS = ["node-sass", "sass"] as const;
export const PREPROCESSORS = [
  "node-sass",
  "sass",
  "less",
  "css",
  "stylus",
] as const;
export type Implementations = typeof IMPLEMENTATIONS[number];
export type Preprocessors = typeof PREPROCESSORS[number];

type Implementation = {
  render: (
    options: RenderOptions,
    parsers?: ParsersType
  ) => Promise<Buffer | string>;
};

/**
 * Determine which default implementation to use by checking which packages
 * are actually installed and available to use.
 *
 * @param resolver DO NOT USE - this is unfortunately necessary only for testing.
 */
export const getDefaultImplementation = (
  resolver: RequireResolve = require.resolve
): Implementations => {
  let pkg: Implementations = "node-sass";

  try {
    resolver("node-sass");
  } catch (error) {
    try {
      resolver("sass");
      pkg = "sass";
    } catch (ignoreError) {
      pkg = "node-sass";
    }
  }

  return pkg;
};

const getFileSyntax = (file: string): sass.Syntax => {
  if (file.toLowerCase().endsWith(".sass")) return "indented";
  return "scss";
};

/**
 * Retrieve the desired preprocessor.
 *
 * @param preprocessor the desired preprocessor.
 */
export const getImplementation = (
  preprocessor?: Preprocessors
): Implementation => {
  let _render: Implementation["render"] | false = false;
  if (preprocessor === "sass") {
    try {
      const { renderSync, compileString } = require("sass") as typeof sass;
      _render = (options) => {
        const { file, includePaths, additionalData } = options;
        const data = readFileData(file, additionalData);
        const syntax = getFileSyntax(file);
        let opts: sass.StringOptions<"sync"> = {
            loadPaths: includePaths,
            syntax,
          },
          legacyOpts: sass.LegacyOptions<"sync"> = {
            ...options,
            importer: options.importer as DartSassLegacyImporter,
            indentedSyntax: syntax === "indented",
            data,
          },
          importer = options.importer;
        if (importer) {
          if (!Array.isArray(importer)) importer = [importer];
          opts.importers = importer.map((_importer) =>
            migrateLegacyImporter(_importer, options)
          );
        }
        return new Promise((resolve) => {
          const { css } = compileString
            ? compileString(data, opts)
            : renderSync(legacyOpts);
          resolve(css);
        });
      };
    } catch (e) {}
  } else if (preprocessor === "node-sass") {
    try {
      const { renderSync } = require("node-sass") as typeof nodeSass;
      _render = (options) => {
        return new Promise((resolve) => {
          const data = readFileData(options.file, options.additionalData);
          const syntax = getFileSyntax(options.file);
          let opts: nodeSass.SyncOptions = {
            ...options,
            importer: options.importer as NodeSassImporter,
            indentedSyntax: syntax === "indented",
            data,
          };
          const { css } = renderSync(opts);
          resolve(css);
        });
      };
    } catch (e) {}
  } else if (preprocessor === "less") {
    try {
      _render = (options) => {
        const { render } = require("less") as typeof less;
        return render(readFileData(options.file, options.additionalData), {
          filename: options.file,
          paths: options.includePaths,
        }).then(({ css }) => css);
      };
    } catch (e) {}
  } else if (preprocessor === "stylus") {
    try {
      const { render } = require("stylus") as typeof stylus;
      _render = (options) => {
        return new Promise((resolve, reject) => {
          render(
            readFileData(options.file, options.additionalData),
            {
              filename: options.file,
            },
            (err, css) => {
              err ? reject(err) : resolve(css ? css : "");
            }
          );
        });
      };
    } catch (e) {}
  }
  if (!_render) {
    _render = (options, parsers) => {
      return new Promise((resolve, reject) => {
        try {
          let src = readFileData(options.file, options.additionalData),
            ext = options.file.split(".").pop();
          if (parsers && ext && ext in parsers) {
            let parser = parsers[ext];
            if (typeof parser === "function") {
              return resolve(parser(src));
            }
          }
          return resolve(src);
        } catch (error) {
          return reject(error);
        }
      });
    };
  }
  return {
    render: _render,
  };
};

export const getPreprocessor = (
  file: string,
  implementation: Implementations = "node-sass"
): Preprocessors => {
  return /\.less$/i.test(file)
    ? "less"
    : /\.styl$/i.test(file)
    ? "stylus"
    : /\.s[ca]ss$/i.test(file)
    ? implementation === "sass"
      ? "sass"
      : "node-sass"
    : "css";
};
