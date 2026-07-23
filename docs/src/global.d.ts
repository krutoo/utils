/// <reference types="@krutoo/utils/typings/css-modules" />

interface ImportMetaEnv {
  [key: string]: any;
  NODE_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
