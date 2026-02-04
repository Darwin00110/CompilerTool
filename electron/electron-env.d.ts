/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  electronAPI: {
    opendialogFile: (languages: string) => Promise<string>,
    opendialogDiretory: () => Promise<string>,
    getTypeCompiler: (type: string) => void
    setConfigMainProgram: () => Promise<{ Saida: string; Error: string; codeProcess: number | null }>,
    setDataUser: () => Promise<object>
  }
}
