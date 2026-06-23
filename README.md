# SASYRA — Reabilitação e Evidência

SASYRA (Sistema de Assistência e Análise em Fisioterapia) é um assistente clínico digital moderno e completo para fisioterapia ortopédica. O sistema integra a prática clínica com preceitos científicos de alta qualidade, reunindo ferramentas de avaliação detalhadas, testes ortopédicos específicos com estatísticas de acurácia, codificação internacional da CIF, diário de evolução clínica, base de evidências científicas (estudos PEDro, revisões Cochrane e diretrizes internacionais) e relatórios automatizados gerados por IA para otimizar o fluxo de trabalho de fisioterapeutas.

---

## 🌟 Funcionalidades Principais

*   **Avaliação Clínica Completa:** Anamnese detalhada, queixa principal, classificação de sintomas, identificação de *red flags* e *yellow flags*, caracterização de dor e avaliação de comorbidades.
*   **Exame Físico e Goniometria:** Avaliação de força muscular (escala MRC de 0 a 5) e mensuração de ADM (Amplitude de Movimento) articular, com alertas visuais dinâmicos para valores fora do padrão de referência.
*   **Testes Ortopédicos Especializados:** Banco de dados integrado com mais de 30 testes ortopédicos para 6 principais regiões (cervical, lombar, ombro, joelho, tornozelo e cotovelo), fornecendo dados de sensibilidade, especificidade, instruções de execução e demonstrações.
*   **Decisão Baseada em Evidências:** Acesso rápido a uma base atualizada de diretrizes de tratamento, contendo estudos com pontuação PEDro $\ge 7$, meta-análises da Cochrane e diretrizes clínicas (CPGs) internacionais.
*   **Análise Clínica com Inteligência Artificial:** Integração projetada com modelos de IA (Claude) para sugerir hipóteses diagnósticas baseadas na CIF, prognósticos, critérios de alta e planos de tratamento personalizados.
*   **Diário de Sessões Evolutivo:** Acompanhamento do progresso do paciente através de sessões, registrando procedimentos aplicados e desenhando gráficos visuais de evolução da dor (Escala Visual Analógica - EVA).
*   **Relatório Multiprofissional:** Geração de relatórios clínicos completos e formatados prontos para impressão ou PDF, para encaminhamentos e compartilhamento com médicos e seguradoras.
*   **Calculadora de Honorários CREFITO:** Estimativa automática de faturamento por procedimento com base na tabela regional oficial do CREFITO e na Resolução COFFITO 424/2013.
*   **Dictation por Voz:** Suporte a reconhecimento de fala em português (PT-BR) em todos os campos de digitação de texto para acelerar a inserção de dados clínicos.

---

## 🛠️ Tecnologias Utilizadas

O ecossistema do SASYRA é construído sob uma arquitetura leve, moderna e reativa:

*   **Core:** React 19 (com hooks modernos)
*   **Build Tool / Dev Server:** Vite 8
*   **Linguagem:** TypeScript 5 (com tipagem estrita para segurança e autocompletar completo)
*   **Estilização:** CSS nativo (Vanilla CSS) com design tokens estruturados para consistência visual e um design escuro premium (Glassmorphism e cores HSL/RGB otimizadas).
*   **Banco de Dados:** Estrutura reativa baseada em módulos TypeScript (`src/data/...`).
*   **Linting:** ESLint 10

---

## 📁 Estrutura do Projeto

A estrutura foi reorganizada de forma modular, separando as preocupações de interface, lógica de negócio, tipos, estilos e integrações de serviços:

```bash
sasyra/
├── .vscode/                 # Configurações do VS Code (incluindo debug do navegador)
├── dist/                    # Bundle de produção compilado pelo Vite
├── public/                  # Arquivos públicos estáticos (favicon, etc.)
├── src/
│   ├── assets/              # Recursos gráficos e ícones locais
│   ├── components/          # Componentes de UI reutilizáveis e modulares (formulários, cards, sliders)
│   ├── data/                # Modelos estáticos e mecanismos baseados em regras (CIF, evidências, articulações)
│   ├── hooks/               # Custom hooks contendo lógica de estado compartilhada (ex: useProgress)
│   ├── pages/               # Componentes a nível de rota (Login, Dashboard, PatientList)
│   ├── services/            # Integração com APIs externas (Supabase, Claude AI)
│   ├── styles/              # Design system, tokens globais (theme.ts) e folhas de estilo (Login.css)
│   ├── types/               # Declaração global de tipos e interfaces TypeScript (index.ts)
│   ├── utils/               # Funções utilitárias auxiliares (cálculo de IMC, goniometria)
│   ├── App.tsx              # Componente principal e roteamento da aplicação
│   ├── index.css            # Estilos de base globais e resets do CSS
│   └── main.tsx             # Ponto de entrada da aplicação React
├── eslint.config.js         # Configuração de linter (ESLint)
├── package.json             # Dependências e scripts de execução npm
├── tsconfig.json            # Configuração do compilador TypeScript
└── vite.config.js           # Configuração de empacotamento do Vite
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
*   [Node.js](https://nodejs.org/) instalado na versão LTS recente (v18 ou superior recomendada).
*   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) para instalação de dependências.

### Passo a Passo

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará ativo em `http://localhost:5173`.

3.  **Execute o linter para verificar conformidade:**
    ```bash
    npm run lint
    ```

4.  **Execute a checagem de tipos TypeScript:**
    ```bash
    npm run typecheck
    ```

5.  **Gere a build de produção:**
    ```bash
    npm run build
    ```
    Os arquivos prontos para implantação serão gerados na pasta `/dist`.

---

## 📋 Scripts Disponíveis

*   `npm run dev` — Inicia o servidor local de desenvolvimento do Vite.
*   `npm run build` — Compila e empacota o código em modo de produção na pasta `dist`.
*   `npm run preview` — Roda o servidor local servindo a pasta `dist` gerada.
*   `npm run lint` — Executa o ESLint em todo o código fonte para identificar violações de regras.
*   `npm run typecheck` — Roda o compilador do TypeScript em modo `--noEmit` para garantir 100% de integridade estática.

---

## 💎 Boas Práticas Utilizadas

1.  **Separação de Preocupações (Separation of Concerns):** A interface apenas consome dados e dispara ações. A lógica de negócio está desacoplada em Custom Hooks (`src/hooks`) e a comunicação com APIs externas está isolada em Serviços (`src/services`).
2.  **Design System Centralizado:** Todas as cores, fontes e propriedades de micro-animações estão agrupadas no token centralizado `COLORS` e `FONTS` no arquivo `theme.ts`, evitando valores hexadecimais ou HSL espalhados de forma arbitrária no CSS inline.
3.  **Tipagem Estrita:** Toda a troca de dados entre páginas e componentes usa tipos TypeScript declarados centralmente em `src/types/index.ts`, garantindo que não existam erros de runtime por propriedades nulas ou ausentes.
4.  **Componentização Inteligente:** Telas massivas foram desmembradas em componentes menores com responsabilidade única, fáceis de testar e ler.
5.  **Clean Code & Zero Warning Policy**: O projeto é mantido sem nenhuma dependência não utilizada, sem trechos de código comentados legados e com conformidade estrita no ESLint e compilador TypeScript.
