import path from "path";
import slash from "slash";

const CURRENT_WORKING_DIRECTORY = process.cwd();

/**
 * Given an absolute file path, generate the its relative path to project root.
 *
 * @param file the file path
 */
export const getRelativePath = (file: string): string => {
  const relativePath = path.relative(CURRENT_WORKING_DIRECTORY, file);

  return slash(relativePath);
};
