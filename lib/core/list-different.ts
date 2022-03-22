import fs from "fs";

import { alerts } from "./alerts";
import { ConfigOptions } from "./types";
import { fileToClassNames } from "../sass";
import {
  classNamesToTypeDefinitions,
  getTypeDefinitionPath,
} from "../typescript";
import { errorHandler } from "./error-handler";
import { getFiles } from "./get-files";

type DiffResult = {
  valid: string[];
  invalid: string[];
};

export const listDifferent = async (
  pattern: string,
  options: ConfigOptions
): Promise<DiffResult> => {
  let result: DiffResult = {
    valid: [],
    invalid: [],
  };
  const files = getFiles(pattern, options.ignore);

  if (!files) {
    return result;
  }

  // Wait for all the files to be checked.
  await Promise.all(files.map((file) => checkFile(file, options))).then(
    (results) => {
      results.forEach((bool, i) => {
        result[bool ? "valid" : "invalid"].push(files[i]);
      });

      alerts.info(
        `Checked ${results.length} file${results.length === 1 ? `` : `s`}. ${
          result.invalid.length || "None"
        } ${result.invalid.length > 1 ? "are" : "is"} invalid.`
      );
    }
  );

  return result;
};

const ignoreEOL = (src: string) => {
  return src.replace(/[\r\n]+/g, "\n");
};
const ignoreQuote = (src: string) => {
  return src.replace(/["']+/g, "");
};

export const checkFile = (
  file: string,
  options: ConfigOptions,
  eol: boolean = true,
  quote: boolean = true
): Promise<boolean> => {
  return new Promise((resolve) =>
    fileToClassNames(file, options)
      .then(async (classNames) => {
        const typeDefinition = await classNamesToTypeDefinitions({
          classNames: classNames,
          ...options,
        });

        if (!typeDefinition) {
          // Assume if no type defs are necessary it's fine
          resolve(true);
          return;
        }
        const path = getTypeDefinitionPath(file, options);

        if (!fs.existsSync(path)) {
          alerts.error(
            `[INVALID TYPES] Type file needs to be generated for ${file} `
          );
          resolve(false);
          return;
        }

        const content = fs.readFileSync(path, { encoding: "utf8" });

        let _content = content,
          _typeDefinition = typeDefinition;
        if (eol) {
          _content = ignoreEOL(_content);
          _typeDefinition = ignoreEOL(_typeDefinition);
        }
        if (quote) {
          _content = ignoreQuote(_content);
          _typeDefinition = ignoreQuote(_typeDefinition);
        }
        if (_content !== _typeDefinition) {
          alerts.error(`[INVALID TYPES] Check type definitions for ${file}`);
          resolve(false);
          return;
        }

        resolve(true);
      })
      .catch((error) => {
        errorHandler(error, `checking ${file}`);

        resolve(false);
      })
  );
};
