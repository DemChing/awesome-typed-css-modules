# Plugins for `PostCSS v6` example

Some plugins for `PostCSS v8` is not compatible to `PostCSS v6`. If you are using `PostCSS v8` plugins, please go [here](../plugins-v8/README.md).

Every processed file is first feed to the parser before `PostCSS` plugins. You should use [`parsers`](../parsers/README.md) if you need to process the file before `PostCSS.process`.

To start, you need to create a config file with something like this:

```javascript
import Plugin from "your-postcss-plugin";

export default {
  plugins: [Plugin],
};
```

This package use `css-modules-loader-core` to extract data from CSS files. By default, it uses some plugins in this order:

1. `postcss-modules-values` - `1.3.0`
2. `postcss-modules-local-by-default` - `1.2.0`
3. `postcss-modules-extract-imports` - `1.1.0`
4. `postcss-modules-scope` - `1.1.0`

Since `plugins` is direcly passed to `PostCSS` (i.e. `postcss(plugins).process( ... )`). If you need those plugins, you can do somthing like this:

```javascript
import { CorePlugins } from "awesome-typed-css-modules";
import Plugin from "your-postcss-plugin";

export default {
  plugins: [Plugin, ...CorePlugins],
};
```

`CorePlugins` already contains those plugins in the same order.

> `awesome-typed-css-modules` also export a plugin list for `PostCSS v8` called `CoreV8Plugins`. Beware to not mix them together.
