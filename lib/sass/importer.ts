import {
  LegacySyncImporter,
  Importer as SassImporter,
  FileImporter,
} from "sass";
import { SyncImporter } from "node-sass";
import { pathToFileURL } from "url";
import { readFileSync, existsSync } from "fs";
import { searchReferenceFile } from "../core";

export type DartSassImporter = SassImporter<"sync"> | FileImporter<"sync">;
export type DartSassLegacyImporter = LegacySyncImporter | LegacySyncImporter[];
export type NodeSassImporter = SyncImporter;
export type LegacyImporter = LegacySyncImporter | SyncImporter;
export type NonLegacyImporter = SyncImporter | DartSassImporter;
export type ValidImporter = LegacyImporter | NonLegacyImporter;
export type RenderOptions = {
  file: string;
  data?: string;
  additionalData?: string;
  importer?: ValidImporter | ValidImporter[];
  includePaths?: string[];
} & Partial<AliasImporterOptions>;

// Hacky way to merge both dart-sass and node-sass importer definitions.
type Importer = LegacySyncImporter & SyncImporter;

export { Importer };

export interface Aliases {
  [index: string]: string;
}

interface AliasImporterOptions {
  aliases: Aliases;
  aliasPrefixes: Aliases;
}

/**
 * Construct a SASS importer to create aliases for imports.
 */
export const aliasImporter =
  ({ aliases, aliasPrefixes }: AliasImporterOptions): Importer =>
  (url: string) => {
    if (url in aliases) {
      const file = aliases[url];

      return {
        file,
      };
    }

    const prefixMatch = Object.keys(aliasPrefixes).find((prefix) =>
      url.startsWith(prefix)
    );

    if (prefixMatch) {
      return {
        file: aliasPrefixes[prefixMatch] + url.substr(prefixMatch.length),
      };
    }

    return null;
  };

export interface SASSImporterOptions {
  aliases?: Aliases;
  aliasPrefixes?: Aliases;
  importer?: Importer | Importer[];
}

/**
 * Construct custom SASS importers based on options.
 *
 *  - Given aliases and alias prefix options, add a custom alias importer.
 *  - Given custom SASS importer(s), append to the list of importers.
 */
export const customImporters = ({
  aliases = {},
  aliasPrefixes = {},
  importer,
}: SASSImporterOptions): Importer[] => {
  const importers: Importer[] = [aliasImporter({ aliases, aliasPrefixes })];

  if (typeof importer === "function") {
    importers.push(importer);
  } else if (Array.isArray(importer)) {
    importers.push(...importer);
  }

  return importers;
};

export const readFileData = (file: string | URL, additionalData?: string) => {
  let data = readFileSync(file, "utf-8");

  if (additionalData) data = `${additionalData}\n${data}`;

  return data;
};

export const migrateLegacyImporter = (
  importer: ValidImporter,
  options: RenderOptions
): DartSassImporter => {
  if ("canonicalize" in importer || "findFileUrl" in importer) {
    return importer;
  }

  return {
    canonicalize(url, { fromImport }) {
      if (!/^[a-z\/._~]/.test(url)) return null;
      let result = (importer as Importer).call(
        {
          callback: undefined,
          options: {
            ...options,
            importer: importer as Importer,
          },
          fromImport,
        },
        url,
        ""
      );

      let target = url;
      if (result) {
        if ("file" in result && result.file) {
          target = searchReferenceFile(options.file, result.file);
        }
      } else {
        let ref = searchReferenceFile(options.file, url);
        if (ref !== url) target = ref;
      }
      return target !== url
        ? pathToFileURL(target)
        : new URL(url, pathToFileURL(options.file));
    },
    load(url) {
      if (existsSync(url)) {
        return {
          contents: readFileData(url, options.additionalData),
          syntax: url.pathname.endsWith(".sass") ? "indented" : "scss",
          sourceMapUrl: url,
        };
      }
      return null;
    },
  };
};
