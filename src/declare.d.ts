// Needed for importing these static resources from .ts files
declare module "*.md"
declare module "*.svg"
declare module "*.jpg"

// Vite types
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
