CompilerTool

CompilerTool é uma aplicação desktop focada em compilação de código para binários, projetada para simplificar o processo de geração de executáveis (.exe) e bibliotecas dinâmicas (.dll) a partir de projetos escritos em C, C++ e Python.

O objetivo da ferramenta é centralizar, em uma interface gráfica única, o fluxo de compilação que normalmente exige múltiplos comandos de terminal, facilitando testes, builds e experimentação durante o desenvolvimento.

🚀 Funcionalidades

Compilação de C para:

Executáveis (.exe)

Bibliotecas dinâmicas (.dll)

Compilação de C++ para:

Executáveis (.exe)

Bibliotecas dinâmicas (.dll)

Compilação de Python para:

Executáveis (.exe)

Interface gráfica simples e focada em produtividade

Integração direta com ferramentas de compilação locais

Execução de processos via backend Electron

Comunicação frontend ↔ backend utilizando IPC

🧩 Tecnologias Utilizadas

Electron

React

Node.js

TypeScript

IPC (Inter-Process Communication)

⚠️ Escopo Atual do Projeto

Atualmente, o CompilerTool atua exclusivamente como uma ferramenta de compilação, não sendo uma IDE completa.

Observações importantes:

A geração de .dll está disponível apenas para C e C++

O suporte a Python está limitado à geração de executáveis (.exe)

O projeto está em evolução e novas opções de saída podem ser adicionadas futuramente

▶️ Executando em ambiente de desenvolvimento
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev


É necessário que os compiladores e ferramentas utilizadas
(GCC/G++, Python, etc.) estejam corretamente instalados e disponíveis no PATH do sistema.

📦 Build
npm run build


O instalador será gerado na pasta de saída configurada no projeto.

🎯 Objetivo do Projeto

Este projeto faz parte do meu portfólio pessoal e tem como foco:

Desenvolvimento de aplicações desktop

Automação de processos de compilação

Integração entre frontend e backend

Orquestração de ferramentas de build via interface gráfica

📌 Considerações Finais

O CompilerTool não tem como objetivo substituir IDEs completas, mas servir como uma ferramenta auxiliar para geração rápida de binários, testes e aprendizado sobre fluxos de compilação.

📄 Licença

Projeto para fins educacionais e de portfólio.
