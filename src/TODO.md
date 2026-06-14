# TODO - SASYRA (Cadastros e múltiplos pacientes)

## 1) Tela de cadastro (fisioterapeuta/usuário)
- [ ] Criar rota/aba inicial para login/cadastro.
- [ ] Usar o mesmo tema do logo (Reabilitação e Evidência).
- [ ] Campos: nome, email, CRM (ou equivalente), senha, aceite de termos.
- [ ] Salvar no estado local (mock) para depois plugar backend.

## 2) Cadastro/seleção de paciente
- [ ] Criar lista de pacientes (mock em memória).
- [ ] Permitir adicionar novo paciente (nome, data nascimento, sexo, queixa).

## 3) Adicionar novas avaliações por paciente
- [ ] Criar estrutura de dados `patients: [{id, nome, ... , evaluations:[...] }]`.
- [ ] Avaliação atual passa a apontar para `selectedPatientId` e `selectedEvaluationId`.
- [ ] Botão “Nova avaliação” cria uma nova avaliação para o paciente selecionado.

## 4) Reaproveitar a tela atual de avaliação
- [ ] Extrair o componente de avaliação existente do `App.jsx` para `EvaluationForm.jsx` (ou semelhante).
- [ ] Garantir que o progresso/percentagem use apenas a avaliação atual.

## 5) Testes manuais
- [ ] Validar que criar paciente > nova avaliação abre tela.
- [ ] Validar que cada paciente guarda avaliações separadas.


