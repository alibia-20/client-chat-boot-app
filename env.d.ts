// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // autres variables d'environnement...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
