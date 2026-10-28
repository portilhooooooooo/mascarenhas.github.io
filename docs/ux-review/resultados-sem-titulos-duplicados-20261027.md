# Navegação sem subtítulos redundantes — branch dev/tasks-workspace

- O botão da navbar volta a exibir **Sol** quando o tema ativo é sol e **Lua** quando o tema ativo é lua. Um clique alterna entre eles, preservando a chave `mba-backoffice-theme-v1`, a preferência salva e a sincronização entre abas.
- Removidos cabeçalhos de página que apenas repetiam o submódulo atualmente selecionado na navbar: Base Geral, Encerramentos, Ranking; Pagamentos, Liminar, Encerramentos e Protocolos de Operação; Defesas e Protocolos de Resultados; Defesas de Operação.
- A tela Base Geral agora começa pelos filtros sem duplicar o nome da carteira que já aparece no seletor lateral. Encerramentos também começa diretamente pelos filtros.
- Mantidos os títulos de blocos internos e contextos não redundantes: Prejuízo X Lucro, Produto, Meta de aging, Composição dos encerramentos, Projeção não homologada, Enter/Pendências Talisman, status operacional, controles de atualização e os títulos dos diálogos.
- Não há mudanças em permissões, métricas, fontes de dados, endpoints ou deploy de produção.
- Testes Node focados (24/24) e build TypeScript/Vite aprovado; captura real de componentes em Chromium, modo Sol e Lua, 1440x900. Capturas em sessão sintética, sem consultas operacionais ou números fictícios.
