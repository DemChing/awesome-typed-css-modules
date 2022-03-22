import Core, { Source } from "css-modules-loader-core";
import CoreV8 from "@demching113/css-modules-loader-core";
import { getFilePath, PostCSSVersion } from "../typescript";

export const CorePlugins = Core.defaultPlugins;
export const CoreV8Plugins = CoreV8.defaultPlugins;

export type CorePluginsType<Version extends PostCSSVersion = "v6"> =
  Version extends "v6" ? typeof CorePlugins : typeof CoreV8Plugins;

export const sourceToClassNames = <T extends PostCSSVersion>(
  source: Source,
  file: string,
  postcss?: T,
  plugins?: CorePluginsType<T>
) => {
  let core: Core | CoreV8;
  if (CoreV8 && postcss === "v8") {
    plugins = (plugins || CoreV8.defaultPlugins) as CorePluginsType<T>;
    core = new CoreV8(plugins as CorePluginsType<"v8">);
  } else {
    plugins = (plugins || Core.defaultPlugins) as CorePluginsType<T>;
    core = new Core(plugins as CorePluginsType);
  }
  let absolutePath = getFilePath(file),
    fromRootPath = absolutePath.split(/:[\\/]/).pop();

  return core.load(source, fromRootPath, undefined, noOpPathFetcher);
};

const noOpPathFetcher = () => Promise.resolve({});
