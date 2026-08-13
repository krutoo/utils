/// <reference types="@krutoo/utils/typings/css-modules" />
/// <reference types="@krutoo/utils/typings/css" />

interface ImportMetaEnv {
  [key: string]: any;
  NODE_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
