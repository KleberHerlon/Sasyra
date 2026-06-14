# Diario/Relatorio — fixes

- [ ] Incluir `const [logs, setLogs] = useState([])`
- [ ] Incluir `const [df, setDf] = useState({ data: ..., eva:5, procedimentos:[], resposta:'', evolucao:'', metas:'' })`
- [ ] Definir `addLog` usando `setLogs` e `df`
- [ ] Substituir `<Logo/>` por `<LogoSVG/>` no header
- [ ] Remover/ignorar o componente interno `const Logo = () => ...` (hoje está causando `static-components`)
- [ ] Corrigir warning do `useEffect` (não setar estado de forma imediata; ou remover dependency)
- [ ] Resolver erros restantes de lint (variáveis não usadas, escape regex)
- [ ] Rodar `npm run lint` até passar

