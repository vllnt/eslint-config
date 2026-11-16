// A type-only stand-in for `@playwright/test`, so the fixtures lint with real
// types without installing Playwright.
declare module "@playwright/test" {
  export type Page = {
    goto: (path: string) => Promise<void>;
    setViewportSize: (size: { height: number; width: number }) => Promise<void>;
    title: () => Promise<string>;
  };
  type Body = (fixtures: { page: Page }) => Promise<void>;
  export const test: {
    (title: string, body: Body): void;
    describe: (title: string, body: () => void) => void;
  };
  export function expect(value: string): { toContain: (part: string) => void };
}
