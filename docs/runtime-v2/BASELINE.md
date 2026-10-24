# Baseline

Frontend investigado: dev/tasks-workspace em 11a17cf58d2afcacbd90f2c92c7cd11591386793. Build original executado com sucesso. Backend: container mba-backoffice-backend, imagem 64b00348da25, label commit 89003b56662e0dcadc1dc7c6eebedcfeb7f7bc10; 2 workers × 4 threads. Checkout operacional main c2cb57d contém dezenas de alterações, preservadas.

Comparação SHA-256 container/release: auth/supabase_auth.py, security/sessions.py, routes/api/me.py e routes/api/encerramentos_analises.py coincidem com 89003b5; routes/api/task_results.py diverge (container 6f9f8c7; commit 88a23f9). Portanto label não prova paridade integral.

Defeitos estáticos reencontrados: mutação de grants em react-compat; currentTaskTab fora de Tarefas retorna execution; shown depende da revisão; Encerramentos aguarda Promise.all; retries empilhados no bootstrap. Reprodução browser: evidence/baseline. Fixture controlada, sem integração ou carga real. Contrafactual explicitamente remove só react-compat para isolar os demais defeitos.

Valores do diagnóstico anterior são históricos, misturam sucesso/erro e NÃO constituem baseline atual. Mediana/P95 real e fila/rede/SQL da mesma requisição permanecem pendentes.
