import path from "path";
import slash from "slash";

const CURRENT_WORKING_DIRECTORY = process.cwd();

/**
 * Given a file path to a file, generate the corresponding file path.
 *
 * @param file the file path
 */
export const getFilePath = (file: string): string => {
  const relativePath = path.relative(CURRENT_WORKING_DIRECTORY, file);
  const resolvedPath = path.resolve(CURRENT_WORKING_DIRECTORY, relativePath);

  return slash(resolvedPath);
};
