const { spawn } = require('node:child_process')

module.exports = () =>
  new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'build:renderer'], { stdio: 'inherit', shell: true })
    proc.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`build:renderer failed with exit code ${code}`))
    })
  })
