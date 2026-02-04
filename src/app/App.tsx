import { useEffect, useState } from 'react';
import { FileCode, Play, RotateCcw, FolderOpen, Terminal } from 'lucide-react';

type Language = 'c' | 'cpp' | 'python';
type OutputType = 'exe' | 'dll';

interface CompilationLog {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
}

export default function App() {
  const [configUser, setConfigUser] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('c');
  const [outputType, setOutputType] = useState<OutputType>('exe');
  const [sourceFile, setSourceFile] = useState<string>('');
  const [outputDir, setOutputDir] = useState<string>('');
  const [compilerFlags, setCompilerFlags] = useState<string>('');
  const [logs, setLogs] = useState<CompilationLog[]>([
    { timestamp: '00:00:00', message: 'Compilation tool ready.', type: 'info' }
  ]);
  const languages = [
    { id: 'c' as Language, name: 'C', icon: '{ }' },
    { id: 'cpp' as Language, name: 'C++', icon: '{ }' },
    { id: 'python' as Language, name: 'Python', icon: 'py' }
  ];
  function loadConfig(){
    window.electronAPI.setDataUser().then((data) => {
      setSourceFile(data.sourceFile ?? '');
      setOutputDir(data.outputDir ?? '')
      setCompilerFlags(data.compilerFlags ?? '')
      setOutputType(data.outputType ?? 'exe')
      setSelectedLanguage(data.language ?? 'c')
    })
  }
  useEffect(() => {
    if(configUser == false){
      loadConfig()
      setConfigUser(true)
    }
  }, [configUser])
  const handleBrowseFile = async () => {
    // Simulate file selection
    await window.electronAPI.opendialogFile(selectedLanguage).then((data) => {
      setSourceFile(data);
      addLog(`Selected file: ${data}`, 'info');
    });
    window.electronAPI.getTypeCompiler(outputType)
  };

  const handleBrowseOutput = () => {
    window.electronAPI.opendialogDiretory().then((data) => {
      setOutputDir(data);
      addLog(`Output directory set: ${data}`, 'info');
    });
  };

  const addLog = (message: string, type: CompilationLog['type']) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  function handleconfigCompiler(){ 
    window.electronAPI.setConfigMainProgram().then((data) => {
      if(data.Saida != undefined){
        addLog(data.Saida, 'info')
        addLog(`Sucesso: ${data.codeProcess}`, "success")
      } else if(data.Error != undefined){
        addLog(`Erro: ${data.Error}`, 'error')
      }
    })
  }

  const handleCompile = () => {
    if (!sourceFile) {
      addLog('Error: No source file selected', 'error');
      return;
    }
    if (!outputDir) {
      addLog('Error: No output directory specified', 'error');
      return;
    }
    
    addLog('Starting compilation...', 'info');
    if(selectedLanguage == "python" && outputType == "dll"){
      setOutputType("exe")
      handleconfigCompiler();
    }
    handleconfigCompiler();
    // Simulate compilation process
    setTimeout(() => {
      const targetType = (selectedLanguage === 'c' || selectedLanguage === 'cpp') 
        ? ` for ${outputType.toUpperCase()}`
        : '';
      addLog(`Compiling ${sourceFile.split('/').pop()} with ${selectedLanguage.toUpperCase()} compiler${targetType}`, 'info');
    }, 300);

    setTimeout(() => {
      if (compilerFlags) {
        addLog(`Using flags: ${compilerFlags}`, 'info');
      }
    }, 600);

    setTimeout(() => {
      addLog('Build successful', 'success');
      const outputFile = selectedLanguage === 'python' 
        ? `${outputDir}/main.pyc`
        : outputType === 'dll'
        ? `${outputDir}/output.dll`
        : `${outputDir}/output.exe`;
      addLog(`Output: ${outputFile}`, 'success');
    }, 1200);
  };

  const handleClear = () => {
    setSourceFile('');
    setOutputDir('');
    setCompilerFlags('');
    setLogs([{ timestamp: '00:00:00', message: 'Compilation tool ready.', type: 'info' }]);
  };

  const getLogColor = (type: CompilationLog['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="dark size-full flex flex-col bg-[#0d0d0d] text-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-[#1a1a1a] border-b border-gray-800">
        <Terminal className="size-5 text-gray-400" />
        <h1 className="text-gray-100">Source Compiler</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8 space-y-8">
            
            {/* Language Selection */}
            <section>
              <label className="block mb-3 text-sm text-gray-400 uppercase tracking-wide">
                Language
              </label>
              <div className="flex gap-2">
                {languages.map(lang => (
                  <div key={lang.id} className="flex-1">
                    <button
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`w-full px-6 py-4 rounded border transition-colors ${
                        selectedLanguage === lang.id
                          ? 'bg-[#2a2a2a] border-gray-600 text-gray-100'
                          : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-[#1f1f1f]'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-mono text-sm">{lang.icon}</span>
                        <span className="text-sm">{lang.name}</span>
                      </div>
                    </button>
                    
                    {/* Sub-options for C and C++ */}
                    {(lang.id === 'c' || lang.id === 'cpp') && selectedLanguage === lang.id && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => setOutputType('exe')}
                          className={`flex-1 px-4 py-2 rounded border text-xs transition-colors ${
                            outputType === 'exe'
                              ? 'bg-[#333333] border-gray-600 text-gray-100'
                              : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-[#1f1f1f]'
                          }`}
                        >
                          EXE
                        </button>
                        <button
                          onClick={() => setOutputType('dll')}
                          className={`flex-1 px-4 py-2 rounded border text-xs transition-colors ${
                            outputType === 'dll'
                              ? 'bg-[#333333] border-gray-600 text-gray-100'
                              : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-[#1f1f1f]'
                          }`}
                        >
                          DLL
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Source File Input */}
            <section>
              <label className="block mb-3 text-sm text-gray-400 uppercase tracking-wide">
                Source File
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sourceFile}
                  readOnly
                  placeholder="No file selected"
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded text-sm font-mono text-gray-300 placeholder:text-gray-600"
                />
                <button
                  onClick={handleBrowseFile}
                  className="px-6 py-3 bg-[#2a2a2a] border border-gray-700 rounded hover:bg-[#333333] transition-colors flex items-center gap-2"
                >
                  <FolderOpen className="size-4" />
                  Browse
                </button>
              </div>
            </section>

            {/* Compilation Options */}
            <section className="space-y-4">
              <label className="block text-sm text-gray-400 uppercase tracking-wide">
                Compilation Options
              </label>
              
              <div>
                <label className="block mb-2 text-xs text-gray-500">Output Directory</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={outputDir}
                    readOnly
                    placeholder="No output directory set"
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded text-sm font-mono text-gray-300 placeholder:text-gray-600"
                  />
                  <button
                    onClick={handleBrowseOutput}
                    className="px-6 py-3 bg-[#2a2a2a] border border-gray-700 rounded hover:bg-[#333333] transition-colors flex items-center gap-2"
                  >
                    <FolderOpen className="size-4" />
                    Browse
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-xs text-gray-500">Compiler Flags (Optional)</label>
                <input
                  type="text"
                  value={compilerFlags}
                  onChange={(e) => setCompilerFlags(e.target.value)}
                  placeholder="-O2 -Wall"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded text-sm font-mono text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-gray-700"
                />
              </div>
            </section>

            {/* Action Controls */}
            <section className="flex gap-3 pt-2">
              <button
                onClick={handleCompile}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-2"
              >
                <Play className="size-4" />
                Compile
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-[#2a2a2a] border border-gray-700 rounded hover:bg-[#333333] transition-colors flex items-center gap-2"
              >
                <RotateCcw className="size-4" />
                Reset
              </button>
            </section>
          </div>
        </div>

        {/* Output / Log Panel */}
        <div className="h-80 border-t border-gray-800 bg-[#0a0a0a] flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#141414] border-b border-gray-800">
            <FileCode className="size-4 text-gray-500" />
            <span className="text-xs text-gray-500 uppercase tracking-wide">Output</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {logs.map((log, idx) => (
              <div key={idx} className="mb-1">
                <span className="text-gray-600">[{log.timestamp}]</span>
                <span className={`ml-2 ${getLogColor(log.type)}`}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
