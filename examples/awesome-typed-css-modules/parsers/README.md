# Parsers example

This is only for `.css`/`.sss` files using `PostCSS` or `SugarSS` features. Parsers should work independantly without depending the version of `PostCSS` this package is used.

Every processed file is first feed to the parser before `PostCSS` plugins. You should use `plugins` if you need to process the file during `PostCSS.process`.

To start, you need to create a config file with something like this:

```javascript
import Parser from "your-custom-parser";

export default {
  parsers: {
    // [fileExtension]: (rawCSS: string) => string
    [ext]: Parser,
  },
};
```
