export {};

declare global {
  interface Window {
    MBA_CURRENT_USER?: { name?: string; nome?: string };
  }
}
