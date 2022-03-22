const Plugin = require("postcss-nested-5");
const { CoreV8Plugins } = require("../../../lib/main");

export const config = {
  postcss: "v8",
  plugins: [Plugin, ...CoreV8Plugins],
};
