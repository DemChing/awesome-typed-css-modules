import { ConfigOptions } from "../core";

import path from "path";
import slash from "slash";

const CURRENT_WORKING_DIRECTORY = process.cwd();

/**
 * Given a file path to a SCSS file, generate the corresponding type definition
 * file path.
 *
 * @param file the SCSS file path
 */
export const getTypeDefinitionPath = (
  file: string,
  options: ConfigOptions
): string => {
  if (options.outputFolder) {
    const relativePath = path.relative(CURRENT_WORKING_DIRECTORY, file);
    const resolvedPath = path.resolve(
      CURRENT_WORKING_DIRECTORY,
      options.outputFolder,
      relativePath
    );

    return slash(`${resolvedPath}.d.ts`);
  } else {
    return slash(`${file}.d.ts`);
  }
};
