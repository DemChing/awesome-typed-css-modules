# Awesome Typed CSS Modules example

This example contains:

- The [way](basic/README.md) to generate .d.ts for different file extensions (`.css`, `.sass`, `.scss`, `.styl`, `.less`, `.sss`).
- The way to generate .d.ts for using PostCSS ([`v6`](plugins/README.md) and [`v8`](plugins-v8/README.md)) plugins.
- The [way](basic/README.md) to generate .d.ts for using custom parsers.

## Migrate from `typed-scss-modules`

> Although you can still use `yarn typed-scss-modules` in CLI, it is better for you to use `yarn awesome-typed-css-modules` instead. Unexpected error may happen if `typed-scss-modules` (or forked package) was installed simultaneously.

If you need to use `PostCSS` plugins, custom parsers or importers for `node-sass` or `sass`, a config file is needed.

You can keep your config file without any change or rename. But if you are creating a new config file, please use `awesome-typed-css-modules.config.js` for `javascript` or `awesome-typed-css-modules.config.ts` for `typescript`.

By default, you should place the comfig file in project root (i.e. current working directory).

However, you could also define `--configFile your/custom/location/of/config.js` to tell the program explicitly.
