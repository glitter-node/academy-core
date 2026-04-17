import { describe, expect, it } from "vitest";

describe("academy-core bundle contract", () => {
  it("exposes top-level exports required by the template engine", async () => {
    const bundle = await import("../../src/index");

    expect(bundle.templateMetadata.identifier).toBe("academy-core");
    expect(typeof bundle.initTemplate).toBe("function");

    for (const componentName of [
      "Div",
      "Span",
      "Button",
      "Input",
      "P",
      "Form",
      "Label",
      "Select",
      "Option",
      "Textarea",
      "Img",
      "Table",
      "Thead",
      "Tbody",
      "Tr",
      "Th",
      "Td",
      "HtmlContent",
      "ThemeToggle",
    ]) {
      expect(bundle[componentName as keyof typeof bundle]).toBeTruthy();
    }
  });
});
