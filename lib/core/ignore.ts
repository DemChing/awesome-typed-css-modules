import { ConfigOptions } from "./types";

export const FileExtensions = [
  "css",
  "scss",
  "sass",
  "less",
  "sss",
  "styl",
] as const;

export const addIgnore = (options: ConfigOptions): string[] => {
  const { includeExtensions, excludeExtensions } = options;
  let ignore = options.ignore || [],
    exts: string[] = [];

  if (includeExtensions) {
    exts = FileExtensions.filter((ext) => !includeExtensions.includes(ext));
  } else if (excludeExtensions) {
    exts = FileExtensions.filter((ext) => excludeExtensions.includes(ext));
  }

  exts.map((ext) => {
    ignore.push(`**/*.${ext}`);
  });

  return ignore;
};
