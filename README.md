# SASYRA — Reabilitação e Evidência

SASYRA (Sistema de Assistência e Análise em Fisioterapia) é um assistente clínico digital moderno e completo para fisioterapia ortopédica. O projeto une a prática clínica a preceitos científicos de alta qualidade, integrando ferramentas de avaliação detalhadas, testes ortopédicos específicos com estatísticas de acurácia, codificação da CIF, diário de evolução clínica, base de dados baseada em evidências (estudos PEDro, revisões Cochrane e diretrizes internacionais) e relatórios automatizados para otimizar o fluxo de trabalho de fisioterapeutas.

---

## 🌟 Funcionalidades Principais

*   **Avaliação Clínica Completa:** Anamnese detalhada, queixa principal, classificação de sintomas, identificação de *red flags* e *yellow flags*, caracterização de dor e avaliação de comorbidades.
*   **Exame Físico e Goniometria:** Avaliação da força muscular (escala MRC de 0 a 5) e mensuração de ADM (Amplitude de Movimento) articular, com alertas visuais dinâmicos para valores fora do padrão de referência.
*   **Testes Ortopédicos Especializados:** Banco de dados integrado com mais de 30 testes ortopédicos para 6 principais regiões (cervical, lombar, ombro, joelho, tornozelo e cotovelo), fornecendo dados de sensibilidade, especificidade, instruções de execução e links para demonstrações em vídeo.
*   **Decisão Baseada em Evidências:** Acesso instantâneo a uma base atualizada de diretrizes de tratamento, contendo estudos com pontuação PEDro $\ge 7$, meta-análises da Cochrane e CPGs internacionais (como JOSPT e NICE).
*   **Análise Clínica com Inteligência Artificial:** Integração projetada com modelos de IA (como Claude) para sugerir hipótese diagnóstica funcional baseada na CIF, prognósticos, critérios de alta e planos de tratamento personalizados.
*   **Diário de Sessões Evolutivo:** Acompanhamento do progresso do paciente através de sessões, registrando procedimentos aplicados e desenhando gráficos visuais de evolução da dor (Escala Visual Analógica - EVA).
*   **Relatório Multiprofissional:** Geração de relatórios clínicos completos e formatados em PDF ou para impressão, prontos para encaminhamentos e compartilhamento com médicos e seguradoras.
*   **Calculadora de Honorários CREFITO:** Estimativa automática de faturamento por procedimento com base na tabela regional oficial do CREFITO e na Resolução COFFITO 424/2013.
*   **Dictation por Voz:** Suporte a reconhecimento de fala em português (PT-BR) em todos os campos de digitação de texto para acelerar a inserção de dados.

---

## 🛠️ Tecnologias Utilizadas

O ecossistema do SASYRA é construído sob uma arquitetura leve, moderna e reativa:

*   **Core:** React 19 (com hooks modernos)
*   **Build Tool:** Vite 8
*   **Estilização:** CSS nativo (Vanilla CSS) com design tokens estruturados para consistência visual e um design escuro premium (Glassmorphism e cores HSL/RGB otimizadas).
*   **Banco de Dados:** Estrutura em memória reativa baseada em JS modules (`src/evidence.js`, `src/cif.js`, etc.)
*   **Linting:** ESLint 10

---

## 📁 Estrutura do Projeto

```bash
sasyra/
├── src/
│   ├── assets/                 # Recursos de imagem e ícones
│   ├── cif.js                  # Dicionário de códigos da CIF
│   ├── cifEngine.js            # Mecanismo de mapeamento automático de sintomas para CIF
│   ├── evidence.js             # Base científica, pontuações PEDro e escalas validadas
│   ├── App.jsx                 # Componente principal unificado (Interface, lógica e estados)
│   ├── App.css                 # Estilização global e tokens do aplicativo
│   ├── index.css               # Estilos de base e reset do CSS
│   └── main.jsx                # Ponto de entrada do React
├── public/                     # Arquivos estáticos públicos
├── eslint.config.js            # Configuração de linting do projeto
├── package.json                # Gerenciador de dependências e scripts do projeto
├── TODO.md                     # Roadmap técnico e tarefas de correções de bugs imediatas
└── README.md                   # Documentação do projeto (este arquivo)
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
*   [Node.js](https://nodejs.org/) instalado na versão LTS recente (v18 ou superior recomendada).
*   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) para instalação de dependências.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/KleberHerlon/Sasyra.git
    cd Sasyra
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  **Acesse no seu navegador:**
    Abra o link local indicado no terminal (geralmente `http://localhost:5173`).

5.  **Gere a build de produção:**
    ```bash
    npm run build
    ```

---

## 🗺️ Roadmap de Desenvolvimento

O desenvolvimento do SASYRA está estruturado nas seguintes prioridades:

1.  **Correção e Estabilização das Abas de Diário e Relatório (Foco Imediato):**
    *   Sincronização correta do histórico de logs entre as sessões salvas e o relatório de impressão.
    *   Substituição e otimização do componente `<Logo />` SVG estável.
    *   Resolução de avisos e erros de linting (`npm run lint`).
2.  **Múltiplos Pacientes & Cadastro de Profissionais:**
    *   Sistema de cadastro de conta e autenticação de fisioterapeutas.
    *   Gerenciador de múltiplos pacientes com busca, mantendo históricos de avaliações isolados por paciente.
3.  **Refatoração Arquitetural:**
    *   Extração de formulários complexos do `App.jsx` para componentes isolados (como `EvaluationForm.jsx` e `HistoryDashboard.jsx`) visando manutenibilidade.
4.  **Integração Real com IA:**
    *   Configuração do endpoint de API para consultas a modelos de linguagem na geração de raciocínio clínico automatizado.

---

## 📄 Licença

Consulte os termos de licença originais do repositório para obter informações sobre compartilhamento e contribuição.
