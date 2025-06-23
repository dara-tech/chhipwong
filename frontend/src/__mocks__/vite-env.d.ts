// Mock Vite environment for testing
declare namespace NodeJS {
  interface ImportMeta {
    env: {
      MODE: string;
      DEV: boolean;
      PROD: boolean;
    };
  }
}

declare const process: {
  env: {
    NODE_ENV: string;
  };
};
