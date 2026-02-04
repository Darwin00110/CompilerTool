import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  opendialogFile: async (languages: string) => ipcRenderer.invoke('open:dialog:File', languages),
  opendialogDiretory: async () => ipcRenderer.invoke('open:dialog:Diretory'),
  getTypeCompiler: async (type: string) => ipcRenderer.send('Get:Type:Compiler', type),
  setConfigMainProgram: async () => ipcRenderer.invoke('config:main:program'),
  setDataUser: async () => ipcRenderer.invoke('set:data:user')
})
