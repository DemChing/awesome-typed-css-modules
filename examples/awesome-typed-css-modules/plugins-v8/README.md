# Plugins for `PostCSS v8` example

Some plugins for `PostCSS v8` is not compatible to `PostCSS v6`. If you are using `PostCSS v6` plugins, please go [here](../plugins/README.md).

Every processed file is first feed to the parser before `PostCSS` plugins. You should use [`parsers`](../parsers/README.md) if you need to process the file before `PostCSS.process`.

To start, you need to create a config file with something like this:

```javascript
import Plugin from "your-postcss-plugin";

export default {
  postcss: "v8", // mandatory, won't work if not specified
  plugins: [Plugin],
};
```

This package use `@demching113/css-modules-loader-core` to extract data from CSS files. By default, it uses some plugins in this order:

1. `postcss-modules-values` - `4.0.0`
2. `postcss-modules-local-by-default` - `4.0.0`
3. `postcss-modules-extract-imports` - `3.0.0`
4. `postcss-modules-scope` - `3.0.0`

Since `plugins` is direcly passed to `PostCSS` (i.e. `postcss(plugins).process( ... )`). If you need those plugins, you can do somthing like this:

```javascript
import { CoreV8Plugins } from "awesome-typed-css-modules";
import Plugin from "your-postcss-plugin";

export default {
  plugins: [Plugin, ...CoreV8Plugins],
};
```

`CoreV8Plugins` already contains those plugins in the same order.

> `awesome-typed-css-modules` also export a plugin list for `PostCSS v6` called `CorePlugins`. Beware to not mix them together.
