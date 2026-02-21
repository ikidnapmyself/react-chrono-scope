import { describe, it, expect } from "vitest";
import { EMPTY_CLASSNAMES, mergeClassNames, resolveClassNames } from "../classnames";

describe("EMPTY_CLASSNAMES", () => {
  it("has all keys as empty strings", () => {
    for (const val of Object.values(EMPTY_CLASSNAMES)) {
      expect(val).toBe("");
    }
  });
});

describe("mergeClassNames", () => {
  it("appends override classes to base", () => {
    const result = mergeClassNames(EMPTY_CLASSNAMES, { root: "my-root" });
    expect(result.root).toBe("my-root");
  });

  it("concatenates when base already has a value", () => {
    const base = { ...EMPTY_CLASSNAMES, root: "base-root" };
    const result = mergeClassNames(base, { root: "extra" });
    expect(result.root).toBe("base-root extra");
  });

  it("replaces with ! prefix", () => {
    const base = { ...EMPTY_CLASSNAMES, root: "base-root" };
    const result = mergeClassNames(base, { root: "!replaced" });
    expect(result.root).toBe("replaced");
  });

  it("applies multiple overrides in order", () => {
    const result = mergeClassNames(
      EMPTY_CLASSNAMES,
      { root: "first" },
      { root: "second" },
    );
    expect(result.root).toBe("first second");
  });

  it("skips undefined overrides", () => {
    const result = mergeClassNames(EMPTY_CLASSNAMES, undefined, { root: "ok" });
    expect(result.root).toBe("ok");
  });

  it("skips undefined values within override", () => {
    const result = mergeClassNames(
      { ...EMPTY_CLASSNAMES, root: "keep" },
      { root: undefined },
    );
    expect(result.root).toBe("keep");
  });

  it("does not mutate the base", () => {
    const base = { ...EMPTY_CLASSNAMES };
    mergeClassNames(base, { root: "added" });
    expect(base.root).toBe("");
  });
});

describe("resolveClassNames", () => {
  it("returns EMPTY_CLASSNAMES when no args", () => {
    const result = resolveClassNames();
    expect(result).toEqual(EMPTY_CLASSNAMES);
  });

  it("returns preset as-is when no overrides", () => {
    const preset = { ...EMPTY_CLASSNAMES, root: "preset-root" };
    const result = resolveClassNames(preset);
    expect(result.root).toBe("preset-root");
  });

  it("merges overrides onto preset", () => {
    const preset = { ...EMPTY_CLASSNAMES, root: "preset" };
    const result = resolveClassNames(preset, { root: "override" });
    expect(result.root).toBe("preset override");
  });

  it("uses EMPTY_CLASSNAMES when preset is undefined", () => {
    const result = resolveClassNames(undefined, { root: "only" });
    expect(result.root).toBe("only");
  });
});
