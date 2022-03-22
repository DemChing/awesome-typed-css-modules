import path from "path";
import slash from "slash";

import { DEFAULT_OPTIONS } from "../../lib/load";
import { getTypeDefinitionPath } from "../../lib/typescript";

describe("getTypeDefinitionPath", () => {
  const cssFilePath = path.resolve(process.cwd(), "some/path/style.scss");

  it("returns the type definition path", () => {
    const outputPath = getTypeDefinitionPath(cssFilePath, DEFAULT_OPTIONS);

    expect(outputPath).toEqual(slash(`${cssFilePath}.d.ts`));
  });

  describe("when outputFolder is passed", () => {
    it("returns the type definition path", () => {
      const outputPath = getTypeDefinitionPath(cssFilePath, {
        ...DEFAULT_OPTIONS,
        outputFolder: "__generated__",
      });

      const generatedFilePath = path.resolve(
        process.cwd(),
        "__generated__/some/path/style.scss.d.ts"
      );

      expect(outputPath).toEqual(slash(generatedFilePath));
    });
  });
});
