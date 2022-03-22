import fs from "fs";
import slash from "slash";

import { alerts, CLIOptions } from "../../lib/core";
import { describeAllImplementations } from "../helpers";
import { main, CorePlugins, CoreV8Plugins } from "../../lib/main";

describe("create type definitions file for different file extensions", () => {
  const directory = `${__dirname}/dummy-styles`;
  const mainTest = (target: string, options: Partial<CLIOptions> = {}) => {
    test(target, async () => {
      const file = `${directory}/${target}`;
      await main(file, {
        ...options,
        crlf: false,
      });

      const expectedPath = slash(file + ".d.ts");

      expect(alerts.warn).toBeCalledTimes(1);
      expect(fs.writeFileSync).toBeCalledWith(
        expectedPath,
        "export const active: string;\nexport const child: string;\nexport const parent: string;\n"
      );
      expect(alerts.success).toBeCalledWith(
        expect.stringContaining(`[GENERATED TYPES] ${expectedPath}`)
      );
      expect(alerts.info).toBeCalledWith(`Generated 1 type definition.`);
    });
  };

  beforeEach(() => {
    jest.spyOn(fs, "writeFileSync").mockImplementation();
    jest.spyOn(alerts, "warn").mockImplementation();
    jest.spyOn(alerts, "success").mockImplementation();
    jest.spyOn(alerts, "info").mockImplementation();
  });

  describeAllImplementations((implementation) => {
    mainTest("style.scss", { implementation });
    mainTest("style.sass", { implementation });
  });

  describe("create type definition for LESS", () => {
    mainTest("style.less");
  });

  describe("create type definition for Stylus", () => {
    mainTest("style.styl");
  });

  describe("create type definition for SugarSS", () => {
    mainTest("style.sss", {
      parsers: {
        sss: require("sugarss").parse,
      },
    });
  });

  describe("create type definition for pure CSS", () => {
    mainTest("style.css");
  });

  describe("create type definition for pure CSS with PostCSS plugin", () => {
    mainTest("plugin.css", {
      plugins: [require("postcss-nested"), ...CorePlugins],
    });
  });

  describe("create type definition for pure CSS with PostCSS v8 plugin", () => {
    mainTest("plugin.css", {
      postcss: "v8",
      plugins: [require("postcss-nested-5"), ...CoreV8Plugins],
    });
  });
});

describe("create type definitions file in examples", () => {
  const Config: {
    [dir: string]: {
      count: number;
      desc: string;
      config?: true;
    };
  } = {
    basic: {
      count: 5,
      desc: "pure CSS, SASS, SCSS, Stylus and LESS files doesn't need extra config",
    },
    parsers: {
      count: 1,
      config: true,
      desc: "provide a custom parser so that you don't need to worry the version of PostCSS using in this package",
    },
    plugins: {
      count: 1,
      config: true,
      desc: "provide plugins that are compatible to PostCSS v6",
    },
    "plugins-v8": {
      count: 1,
      config: true,
      desc: "provide plugins that are compatible to PostCSS v8",
    },
  };

  beforeEach(() => {
    jest.spyOn(fs, "writeFileSync").mockImplementation();
    jest.spyOn(alerts, "warn").mockImplementation();
    jest.spyOn(alerts, "success").mockImplementation();
    jest.spyOn(alerts, "info").mockImplementation();
  });

  Object.keys(Config).map((dir) => {
    const { config, count, desc } = Config[dir];

    const path = `examples/awesome-typed-css-modules/${dir}`;
    test(`should run the awesome-typed-css-modules > ${dir} example without errors`, async () => {
      await main(path, {
        banner: `// ${desc}`,
        configFile: config ? `${path}/awesome-typed-css-modules.config.js` : "",
        exportType: "default",
        nameFormat: "kebab",
        crlf: false,
      });

      const expectedPath = slash(`${process.cwd()}/${path}`);

      expect(alerts.warn).toBeCalledTimes(count > 1 ? 0 : 1);
      expect(fs.writeFileSync).toBeCalledTimes(count);
      expect(alerts.success).toBeCalledWith(
        expect.stringContaining(`[GENERATED TYPES] ${expectedPath}`)
      );
      expect(alerts.info).toBeCalledWith(
        `Generated ${count} type definition${count > 1 ? "s" : ""}.`
      );
    });
  });
});
