import { app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent } from 'electron'
//import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
//import { create } from 'node:domain'
//const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

//Variaveis do sistema
const pathJSON = path.resolve(path.join(app.getPath('userData'), 'DataUser.json'))

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.APP_ROOT, 'icon', 'mdi-gear.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
interface requestUser {
  language: "c" | "cpp" | "python",
  outputType: "exe" | "dll",
  sourceFile: string,
  outputDir: string,
  compilerFlags: string
}
const valoresUser: requestUser = {
  language: "c",
  outputType: "exe",
  compilerFlags: "",
  sourceFile: "",
  outputDir: "",
};

async function loadConfig() {
  try {
    const json = await fs.readFile(pathJSON, 'utf-8');
    const data = JSON.parse(json);
    valoresUser.language = data.language || 'c';
    valoresUser.outputType = data.outputType || 'exe';
    valoresUser.compilerFlags = data.compilerFlags ?? '';
    valoresUser.sourceFile = data.sourceFile ?? '';
    valoresUser.outputDir = data.outputDir ?? '';
  } catch (e) {
    try {
      await fs.writeFile(pathJSON, JSON.stringify(valoresUser, null, 2), 'utf8');
    } catch (e) {
      return
    }
  }
}
loadConfig()
ipcMain.handle('set:data:user', async () => {
  return {
    language: valoresUser.language,
    outputType: valoresUser.outputType,
    compilerFlags: valoresUser.compilerFlags,
    sourceFile: valoresUser.sourceFile,
    outputDir: valoresUser.outputDir,
  }
})

ipcMain.handle("open:dialog:File", async (event: IpcMainInvokeEvent, languages: string): Promise<object> => {
  let filtro = languages.toLowerCase()
  if (filtro == "python") {
    filtro = "py"
  } else if (filtro == "c") {
    filtro = "c"
  } else if (filtro == "cpp") {
    filtro = "cpp"
  }
  const FileDialog = await dialog.showOpenDialog({
    title: "Selecione o Arquivo ." + languages,
    properties: ["openFile"],
    filters: [{ name: "." + filtro, extensions: [filtro] }]
  })

  valoresUser.language = filtro == "py" ? "python" : filtro;

  valoresUser.sourceFile = FileDialog.filePaths[0]

  return FileDialog.filePaths[0] || ""
})

ipcMain.handle("open:dialog:Diretory", async (): Promise<object> => {
  const FileDialog = await dialog.showOpenDialog({
    title: "Selecione o diretorio ",
    properties: ["openDirectory"],
  })
  valoresUser.outputDir = FileDialog.filePaths[0]

  return FileDialog.filePaths[0] || ""
})
ipcMain.on('Get:Type:Compiler', (event: IpcMainInvokeEvent, type: string) => {
  valoresUser.outputType = type
})

function runProcess(command: string, args: string[]) {
  return new Promise<{ Saida: string; Error: string; codeProcess: number | null }>((resolve) => {
    const processo = spawn(command, args, { shell: false })
    let stdout = ''
    let stderr = ''
    processo.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    processo.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    processo.on('close', (code) => {
      const codeProcess = typeof code === 'number' ? code : null
      const ok = codeProcess === 0
      const stdoutTrim = stdout.trim()
      const stderrTrim = stderr.trim()
      const Saida = ok ? (stdoutTrim || stderrTrim) : ''
      const Error = ok ? '' : (stderrTrim || stdoutTrim)
      resolve({ Saida, Error, codeProcess })
    })
  })
}

ipcMain.handle("config:main:program", async () => {
  try {
    await fs.access(valoresUser.sourceFile)
    await fs.access(valoresUser.outputDir)
    await fs.writeFile(pathJSON, JSON.stringify(valoresUser, null, 2), 'utf8');
  } catch (e) {
    return {
      Error: "Erro: Arquivo ou Diretorio n??o encontrado"
    }
  }
  if (!valoresUser.sourceFile || !valoresUser.outputDir) {
    return {
      Error: "Erro: Arquivo ou Diretorio n??o encontrado"
    }
  }
  if (valoresUser.language == "c") {
    if (valoresUser.outputType == "exe") {
      return await runProcess('cmd.exe', ['/c', 'gcc', valoresUser.sourceFile, '-o', path.join(valoresUser.outputDir, 'main.exe')])
    } else if (valoresUser.outputType == "dll") {
      return await runProcess('cmd.exe', ['/c', 'gcc', '-shared', '-o', path.join(valoresUser.outputDir, 'main.dll'), valoresUser.sourceFile])
    }
  } else if (valoresUser.language == "cpp") {
    if (valoresUser.outputType == "exe") {
      return await runProcess('cmd.exe', ['/c', 'g++', valoresUser.sourceFile, '-o', path.join(valoresUser.outputDir, 'main.exe')])
    } else if (valoresUser.outputType == "dll") {
      return await runProcess('cmd.exe', ['/c', 'g++', '-shared', '-o', path.join(valoresUser.outputDir, 'main.dll'), valoresUser.sourceFile])
    }
  } else if (valoresUser.language == "python") {
    return await runProcess('cmd.exe', ['/c', 'pyinstaller', '--onefile', '--distpath', valoresUser.outputDir, valoresUser.sourceFile])
  }
  return {
    Saida: '',
    Error: 'Erro: linguagem n??o suportada',
    codeProcess: null
  }
})
