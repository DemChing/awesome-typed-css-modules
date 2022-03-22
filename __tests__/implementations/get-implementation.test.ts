import { getPreprocessor } from "../../lib/implementations";

describe("getPreprocessor", () => {
  it("returns the correct preprocessor when explicitly passed", () => {
    expect(getPreprocessor("file.scss", "node-sass")).toEqual("node-sass");
    expect(getPreprocessor("file.scss", "sass")).toEqual("sass");
    expect(getPreprocessor("file.styl", "node-sass")).toEqual("stylus");
    expect(getPreprocessor("file.less", "sass")).toEqual("less");
    expect(getPreprocessor("file.css", "sass")).toEqual("css");
  });

  it("returns the correct default preprocessor if it is invalid", () => {
    expect(getPreprocessor("file.scss", "wat-sass" as any)).toEqual(
      "node-sass"
    );
    expect(getPreprocessor("file.scss")).toEqual("node-sass");
    expect(getPreprocessor("file.invalid")).toEqual("css");
  });
});
