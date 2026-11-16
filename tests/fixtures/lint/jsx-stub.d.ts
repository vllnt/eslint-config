// A type-only stand-in for React's JSX types, so `.tsx` fixtures lint with real
// types without installing React.
declare namespace JSX {
  type Element = { readonly tag: string };
  type IntrinsicElements = Record<string, { children?: string }>;
}
