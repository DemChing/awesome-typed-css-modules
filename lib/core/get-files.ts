import glob from "glob";
import { extname, dirname, resolve, basename } from "path";
import { alerts } from "./alerts";

export const getFiles = (pattern: string, ignore?: string[]) => {
  ignore = ignore || [];
  ignore.push("**/*.d.ts");
  // Find all the files that match the provided pattern.
  const files = glob.sync(pattern, { ignore });

  if (!files || !files.length) {
    alerts.error("No files found.");
    return;
  }

  // This case still works as expected but it's easy to do on accident so
  // provide a (hopefully) helpful warning.
  if (files.length === 1) {
    alerts.warn(
      `Only 1 file found for ${pattern}. If using a glob pattern (eg: dir/**/*.scss) make sure to wrap in quotes (eg: "dir/**/*.scss").`
    );
  }

  return files;
};

const getFileName = (file: string, withoutExt: boolean = false) => {
  let fname = basename(file);

  if (withoutExt) {
    fname = fname.replace(extname(fname), "");
  }

  return fname;
};

export const searchReferenceFile = (file: string, target: string) => {
  let dir = dirname(resolve(file)),
    fname = getFileName(target),
    fnameWE = getFileName(target, true),
    ext = extname(file),
    pattern = resolve(dir, target);
  if (!pattern.toLowerCase().endsWith(ext)) {
    pattern += `*${ext}`;
  }

  const files = glob.sync(pattern);
  let resolved = target;

  if (files && files.length) {
    if (files.length === 1) resolved = files[0];
    else {
      // First get the file with exact filename
      let find = files.find((file) => file === fname);
      // Else get the file with its name = [basename].module
      if (!find) {
        find = files.find(
          (file) => getFileName(file, true) === `${fnameWE}.module`
        );
      }
      // Else get the file with its name = [basename]
      if (!find) {
        find = files.find((file) => getFileName(file, true) === fnameWE);
      }
      if (find) resolved = find;
    }
  }

  return resolved;
};
