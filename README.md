
# CompilerTool

CompilerTool é uma aplicação desktop focada em compilação de código para binários, desenvolvida para simplificar a geração de executáveis (.exe) e bibliotecas dinâmicas (.dll) a partir de projetos escritos em C, C++ e Python.

A ferramenta centraliza, em uma interface gráfica, fluxos de compilação que normalmente exigem múltiplos comandos de terminal, tornando o processo mais direto, organizado e acessível durante o desenvolvimento.

# ✨ Features

Compilação de C para:

.exe

.dll

Compilação de C++ para:

.exe

.dll

Compilação de Python para:

.exe

Interface gráfica focada em produtividade

Integração direta com compiladores e ferramentas locais

Orquestração de processos via backend Electron

Comunicação Frontend ↔ Backend utilizando IPC

# 🧱 Tech Stack

Electron

React

Node.js

TypeScript

IPC (Inter-Process Communication)

# 📌 Scope & Limitations

O CompilerTool atua exclusivamente como uma ferramenta de compilação

Não é uma IDE completa

A geração de .dll está disponível apenas para C e C++

O suporte a Python está limitado à geração de executáveis (.exe)

# ▶️ Development Setup
# Install dependencies
npm install

# Run in development mode
npm run dev


Certifique-se de que os compiladores e interpretadores necessários
(GCC/G++, Python, etc.) estejam corretamente instalados e disponíveis no PATH.

# 📦 Build
npm run build


O instalador será gerado na pasta de saída configurada no projeto.

# 🎯 Project Goal

Este projeto faz parte do meu portfólio pessoal e tem como objetivo:

Desenvolvimento de aplicações desktop

Automação de processos de compilação

Integração entre frontend e backend

Organização de fluxos de build por meio de interface gráfica

# 📄 License

Projeto desenvolvido para fins educacionais e de portfólio.
