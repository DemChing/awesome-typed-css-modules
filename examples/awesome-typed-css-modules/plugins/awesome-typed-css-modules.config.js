const Plugin = require("postcss-nested");
const { CorePlugins } = require("../../../lib/main");

export const config = {
  plugins: [Plugin, ...CorePlugins],
};
