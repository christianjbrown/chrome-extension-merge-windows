// Vite's ?raw import: a file's text, so a test can read it without node types.
declare module "*?raw" {
  const text: string;
  export default text;
}
