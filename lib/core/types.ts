import { SASSOptions, CorePluginsType } from "../sass";
import {
  ExportType,
  QuoteType,
  LogLevel,
  ParsersType,
  PostCSSVersion,
} from "../typescript";

type CLIOnlyOptions = Extract<keyof SASSOptions, "importer">;

export interface CLIOptions extends Exclude<SASSOptions, CLIOnlyOptions> {
  banner: string;
  ignore?: string[];
  ignoreInitial?: boolean;
  exportType: ExportType;
  exportTypeName?: string;
  exportTypeInterface?: string;
  listDifferent?: boolean;
  quoteType?: QuoteType;
  updateStaleOnly?: boolean;
  watch?: boolean;
  logLevel?: LogLevel;
  outputFolder?: string | null;
  configFile?: string;
  crlf?: boolean;
  includeExtensions?: string[];
  excludeExtensions?: string[];
  postcss?: PostCSSVersion;
}

export interface ConfigOptions extends CLIOptions, SASSOptions {
  plugins?: CorePluginsType;
  parsers?: ParsersType;
}
