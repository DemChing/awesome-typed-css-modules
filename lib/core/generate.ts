import { alerts } from "./alerts";
import { getFiles } from "./get-files";
import { ConfigOptions } from "./types";
import { writeFile } from "./write-file";

type GenerateResult = {
  [file: string]: string | undefined;
};

/**
 * Given a file glob generate the corresponding types once.
 *
 * @param pattern the file pattern to generate type definitions for
 * @param options the CLI options
 */
export const generate = async (
  pattern: string,
  options: ConfigOptions
): Promise<GenerateResult> => {
  let result: GenerateResult = {};
  const files = getFiles(pattern, options.ignore);

  if (!files) {
    return result;
  }

  alerts.success(
    `Found ${files.length} file${
      files.length === 1 ? `` : `s`
    }. Generating type definitions...`
  );

  // Wait for all the type definitions to be written.
  let results = await Promise.all(
      files.map((file) => writeFile(file, options))
    ),
    generated = 0;
  results.forEach((typeFile, i) => {
    result[files[i]] = typeFile;
    generated += typeFile ? 1 : 0;
  });

  alerts.info(
    `Generated ${generated} type definition${generated > 1 ? `s` : ""}.`
  );

  return result;
};
