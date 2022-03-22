# Basic example

All .d.ts files in this directory can be generated in a single command (_in the root of this repository_):

```bash
yarn awesome-typed-css-modules "examples/awesome-typed-css-modules/basic" --exportType default --nameFormat kebab
```

If you want to generate specific extension (e.g. `.less`), you can replace the command to:

```bash
yarn awesome-typed-css-modules "examples/awesome-typed-css-modules/basic/**/*.less" --exportType default --nameFormat kebab
```

Or in case you somehow have many CSS files in different extensions, but only want to generate (or not generate) some extensions, use [`--includeExtensions`](../../../README.md#includeextensions) or [`--excludeExtensions`](../../../README.md#excludeextensions).
