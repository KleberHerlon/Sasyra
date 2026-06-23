# Análise de Custos de Infraestrutura — SASYRA

**Data:** Junho/2026
**Analista:** Arquitetura de Sistemas & FinOps

---

## 1. ARQUITETURA ATUAL (estado zero)

```
Usuário → Browser → [React SPA (Vite)] → localStorage (todos os dados)
                                         → Express Proxy → Anthropic Claude API
```

- **Zero banco de dados** — 100% localStorage (limite de ~5-10 MB por domínio)
- **Zero autenticação real** — login simulado (setTimeout de 1,5s)
- **Zero armazenamento de arquivos** — sem fotos, documentos ou anexos
- **Única API externa:** Anthropic Claude (modelo `claude-sonnet-4-6`)
- **Proxy Express:** 56 linhas, 2 rotas funcionais (`/api/anthropic`, `/api/health`)

---

## 2. ARQUITETURA PROPOSTA (pós-migração)

```
Usuário → CDN (Vercel/Netlify) → React SPA
                                  ↓
                            API REST (Node.js)
                            ├── Auth (Supabase)
                            ├── CRUD Pacientes/Avaliações
                            ├── Agenda / Financeiro
                            └── Proxy → Anthropic Claude
                                  ↓
                            PostgreSQL (Supabase)
                            └── 12 tabelas estimadas
```

### 2.1 Modelo de Dados — 12 Tabelas

| Tabela | Registros estimados (1 ano) | Tamanho por registro | Total |
|--------|---------------------------|---------------------|-------|
| `usuarios` | 5-20 | ~0,5 KB | ~10 KB |
| `pacientes` | 50-500 | ~1 KB | ~500 KB |
| `avaliacoes` | 100-1.500 | ~5 KB | ~7,5 MB |
| `logs_evolucao` | 500-5.000 | ~1,5 KB | ~7,5 MB |
| `agenda_compromissos` | 500-5.000 | ~0,5 KB | ~2,5 MB |
| `financeiro_pagamentos` | 500-3.000 | ~0,3 KB | ~900 KB |
| `financeiro_despesas` | 50-500 | ~0,3 KB | ~150 KB |
| `alunos_ef` | 20-200 | ~2 KB | ~400 KB |
| `treinos_ef` | 50-500 | ~10 KB | ~5 MB |
| `pse_sessoes` | 200-2.000 | ~0,3 KB | ~600 KB |
| `subscriptions` | 5-20 | ~1 KB | ~20 KB |
| `analises_ia` | 50-500 | ~3 KB | ~1,5 MB |
| **Total** | | | **~27 MB** |

> Nota: 27 MB/ano para uma clínica pequena (3 profissionais, 200 pacientes).
> O Supabase Free (500 MB) suporta anos de operação sem custo de banco.

---

## 3. CENÁRIOS DE CUSTO (sem mão de obra humana)

### Cenário A — MVP / Validação (1-3 meses, <50 pacientes)

| Item | Serviço | Custo |
|------|---------|-------|
| Frontend (SPA estático) | Vercel Free — 100 GB banda, 100 deploys/dia | **$0/mês** |
| Backend API | Railway Starter — 512 MB RAM, 1 CPU, 1 GB disk | **$5/mês** |
| Banco de Dados (PostgreSQL) | Supabase Free — 500 MB DB, 2 GB banda | **$0/mês** |
| Autenticação | Supabase Auth Free — 50 mil MAU | **$0/mês** |
| Domínio `.com.br` | Registro.br — 1 ano | **R$ 40/ano (~$1/mês)** |
| CDN + SSL | Vercel Free (incluído) | **$0/mês** |
| Email transacional | Resend Free — 500 emails/dia | **$0/mês** |
| Monitoramento | Sentry Free — 5k erros/mês | **$0/mês** |
| **IA (Anthropic Claude)** | Pay-per-use (ver seção 4) | **~$5-15/mês** |
| **Total Cenário A** | | **~$6-20/mês** |

### Cenário B — Crescimento (6-12 meses, 200+ pacientes, 5+ profissionais)

| Item | Serviço | Custo |
|------|---------|-------|
| Frontend | Vercel Pro — equipe, previews, 1 TB banda | **$20/mês** |
| Backend API | Railway Starter — escopo atual OK | **$5/mês** |
| Banco de Dados | Supabase Pro — 8 GB DB, 50 GB banda, 100 GB storage | **$25/mês** |
| Autenticação | Incluso no Supabase Pro | **$0/mês** |
| Domínio `.com.br` | Já adquirido | **~$1/mês** |
| CDN + SSL | Vercel Pro (incluído) | **$0/mês** |
| Email transacional | Resend Pro — 50k emails/mês | **$15/mês** |
| Monitoramento | Sentry Team — 100k erros | **$26/mês** |
| Armazenamento arquivos | Supabase Storage (incluído no Pro) | **$0/mês** |
| **IA (Anthropic Claude)** | Volume maior (ver seção 4) | **~$30-60/mês** |
| **Total Cenário B** | | **~$120-150/mês** |

### Cenário C — Escala (franquias, múltiplas clínicas)

| Item | Serviço | Custo |
|------|---------|-------|
| Frontend | Vercel Enterprise ou Cloudflare Pages | **$50-100/mês** |
| Backend API | Railway Scale — 2 GB RAM, 2 CPU | **$20/mês** |
| Banco de Dados | Supabase Team — 16 GB DB, 500 GB banda | **$75/mês** |
| Cache/Redis | Upstash Redis — 10 MB | **$0/mês** |
| Autenticação | Incluso no Supabase Team | **$0/mês** |
| Domínio | Já adquirido | **~$1/mês** |
| CDN + WAF | Cloudflare Pro — $20/mês | **$20/mês** |
| Email | SendGrid Essentials — 50k/mês | **$20/mês** |
| Monitoramento + Logs | Grafana Cloud Free + Sentry | **$0-30/mês** |
| Armazenamento arquivos | Supabase Storage (100 GB) | **Incluso** |
| Backup automatizado | Supabase (point-in-time recovery) | **Incluso** |
| **IA (Anthropic Claude)** | Contrato direto Anthropic (desconto por volume) | **~$100-300/mês** |
| **Total Cenário C** | | **~$300-600/mês** |

---

## 4. CUSTO DA IA (Anthropic Claude)

### 4.1 Precificação Anthropic (modelo `claude-sonnet-4-6`)

| Métrica | Valor |
|---------|-------|
| Input tokens | **$3,00/milhão** de tokens |
| Output tokens | **$15,00/milhão** de tokens |
| Tamanho típico por análise | ~2.000 input + ~1.000 output tokens |
| **Custo por análise** | **~$0,021** |
| Custo com buffer de 20% | **~$0,025/análise** |

### 4.2 Comparativo: Custo vs. Preço cobrado ao usuário

| Item | Valor |
|------|-------|
| Preço avulso cobrado do usuário | R$ 4,90 (~$0,98) |
| Custo real (Anthropic) | ~$0,025 (~R$ 0,13) |
| **Margem bruta por análise** | **~R$ 4,77 (97,4%)** |
| Plano IA Premium (300 análises/mês) | R$ 79,90 (~$15,98) |
| Custo real (300 análises) | ~$7,50 (~R$ 37,50) |
| **Margem bruta IA Premium** | **~R$ 42,40 (53%)** |

> **Conclusão:** A IA é altamente lucrativa no modelo avulso (97% margem) e saudável no plano Premium (53%). O risco é baixo — mesmo que o usuário use 300 análises no plano Premium, o custo é metade do preço cobrado.

### 4.3 Projeção de custo de IA por cenário

| Cenário | Análises/mês | Custo Anthropic | Faturamento IA | Margem |
|---------|:-----------:|:---------------:|:--------------:|:------:|
| A — MVP | 50-200 | $1,25-5,00 | R$ 80-490 | 90-97% |
| B — Crescimento | 300-1.500 | $7,50-37,50 | R$ 1.200-7.350 | 53-95% |
| C — Escala | 2.000-10.000 | $50-250 | R$ 9.800-49.000 | 50-96% |

---

## 5. COMPARATIVO: PLANOS DE ASSINATURA vs. CUSTOS DE INFRA

### 5.1 Rateio de custos fixos por assinante (Cenário B — 100 assinantes)

| Item | Custo total/mês | Por assinante (100) |
|------|:--------------:|:------------------:|
| Frontend + Backend | $25 | **$0,25** |
| Banco de Dados | $25 | **$0,25** |
| Email + Monitoramento | $41 | **$0,41** |
| IA (média 500 análises) | $13 | **$0,13** |
| **Custo fixo por assinante** | | **~$1,04/mês (~R$ 5,20)** |

### 5.2 Margem por plano

| Plano | Preço (R$) | Preço ($) | Custo infra | Custo IA médio | Lucro/assinante | Margem |
|------|:---------:|:---------:|:----------:|:--------------:|:--------------:|:------:|
| Start (R$ 9,90) | 9,90 | ~1,98 | 1,04 | 0 | **0,94** | **47%** |
| Evidencia (R$ 14,90) | 14,90 | ~2,98 | 1,04 | 0 | **1,94** | **65%** |
| Clínicas (R$ 49,90) | 49,90 | ~9,98 | 1,04 | 0 | **8,94** | **90%** |
| IA Premium (R$ 79,90) | 79,90 | ~15,98 | 1,04 | 7,50 | **7,44** | **47%** |

> Nota: IA Premium considera uso médio de 150 análises/mês (metade do limite de 300).
> O plano Clínicas tem a maior margem percentual por exigir pouca infraestrutura adicional.

---

## 6. RECOMENDAÇÃO DE ARQUITETURA

### 6.1 Stack recomendado (Cenário A — início imediato)

```
Frontend:    Vercel (Free) + React SPA (Vite)
Backend:     Node.js + Express → Railway ($5/mês)
Database:    Supabase PostgreSQL (Free)
Auth:        Supabase Auth (Free) — migrar do login simulado
Storage:     Supabase Storage (Free — 1 GB)
AI Proxy:    Mesmo servidor Railway (rota /api/anthropic)
Domínio:     sasyra.com.br via Registro.br (R$ 40/ano)
Monitor:     Sentry Free (5k erros/mês)
```

**Custo inicial mensal: ~$6/mês (~R$ 30/mês)**
**Custo inicial anual: ~$72 + R$ 40 (domínio) ≈ ~R$ 440/ano**

### 6.2 Passos para migração (estimativa de esforço técnico)

| Passo | O que fazer | Esforço |
|-------|-----------|---------|
| 1 | Criar tabelas no Supabase (SQL schema) | 2 dias |
| 2 | Migrar hooks `useLocalStorage` → chamadas Supabase | 5 dias |
| 3 | Migrar autenticação (Supabase Auth) | 3 dias |
| 4 | Criar API REST (CRUD) no Express | 5 dias |
| 5 | Adaptar frontend para estado assíncrono (loading/error) | 4 dias |
| 6 | Migrar dados existentes (script de importação) | 1 dia |
| 7 | Testes de migração + rollback | 2 dias |
| **Total** | | **~22 dias úteis** |

> Os 22 dias são de **esforço técnico** (não incluso no custo de infraestrutura, conforme solicitado).

### 6.3 Economia comparativa

| Provedor | Frontend | Backend | DB | Auth | Total/mês |
|----------|:-------:|:-------:|:--:|:----:|:--------:|
| **Railway + Supabase (recomendado)** | $0 | $5 | $0 | $0 | **$5** |
| Render + Supabase | $0 | $7 | $0 | $0 | **$7** |
| Fly.io + Supabase | $0 | $2 (1.5GB) | $0 | $0 | **$2** |
| Vercel + Neon DB | $0 | $0 | $0 (free) | $0 | **$0** |
| Digital Ocean (VPS tudo-em-um) | $12 | $12 | $12 | - | **$12** |
| AWS (EC2 + RDS) | $8 | $15 | $15 | - | **~$38** |

---

## 7. RESUMO EXECUTIVO

| Cenário | Custo/mês | Custo/ano | Ideal para |
|---------|:--------:|:---------:|------------|
| **A — MVP** | **~$6-20** | **~$72-240** | Validação, primeiros 50 pacientes |
| **B — Crescimento** | **~$120-150** | **~$1.440-1.800** | Clínica estabelecida, 200+ pacientes |
| **C — Escala** | **~$300-600** | **~$3.600-7.200** | Franquias, múltiplas unidades |

**Recomendação:** Começar pelo Cenário A (Railway + Supabase Free) que custa ~R$ 30/mês. A migração do localStorage para Supabase é o passo crítico e pode ser feita incrementalmente — não precisa migrar tudo de uma vez.

**Custo de IA é autossustentável** — a margem de 97% nas análises avulsas e 53% no plano Premium faz com que o uso da IA gere lucro, não despesa.

**O maior risco de custo não é infraestrutura, é o tempo de desenvolvimento para migrar** (estimado em 22 dias úteis). A infraestrutura em si é extremamente enxuta.
