# Baseline

Frontend investigado: dev/tasks-workspace em 11a17cf58d2afcacbd90f2c92c7cd11591386793. Build original executado com sucesso. Backend: container mba-backoffice-backend, imagem 64b00348da25, label commit 89003b56662e0dcadc1dc7c6eebedcfeb7f7bc10; 2 workers × 4 threads. Checkout operacional main c2cb57d contém dezenas de alterações, preservadas.

Comparação SHA-256 container/release: auth/supabase_auth.py, security/sessions.py, routes/api/me.py e routes/api/encerramentos_analises.py coincidem com 89003b5; routes/api/task_results.py diverge (container 6f9f8c7; commit 88a23f9). Portanto label não prova paridade integral.

Defeitos estáticos reencontrados: mutação de grants em react-compat; currentTaskTab fora de Tarefas retorna execution; shown depende da revisão; Encerramentos aguarda Promise.all; retries empilhados no bootstrap. Reprodução browser: evidence/baseline-repeat. Fixture controlada, sem integração ou carga real. Contrafactual explicitamente remove só react-compat para isolar os demais defeitos.

Valores do diagnóstico anterior são históricos, misturam sucesso/erro e NÃO constituem baseline atual. Mediana/P95 real e fila/rede/SQL da mesma requisição permanecem pendentes.

## Verificação ampliada

O frontend main remoto está em f0851b3. SHA-256 do auth.js publicado: 76ec1bdb26ec0c1435ccb94e6b4f9d6b9beb6b9ea3fc641645d7ad97e32aa996, idêntico ao arquivo desse commit. Nesse arquivo, loadProfile emite mba:authenticated com detail: profile; react-compat.js tem o mesmo SHA no main e no baseline dev (2cbbf11f...). Portanto, a emissão explícita do evento com referência compartilhada no ensaio corresponde ao contrato do auth publicado. O bootstrap original da branch dev usa uma cópia/proxy e pode passar na abertura inicial; não confundir esse resultado com imutabilidade dos listeners.

A comparação ampliada dos caminhos Python rastreados encontrou 43 diferenças fora de tests/ contra a revisão declarada 89003b5: 34 arquivos diferentes e 9 ausentes no container. O inventário completo e hashes estão na branch backend em docs/runtime-v2/RUNTIME_DRIFT.json. Arquivos extras do runtime não são integralmente inventariados. Não são 43 defeitos; são 43 divergências de proveniência que exigem reconciliação.

O replay baseline-repeat mantém o build original 11a17cf e falha em A01/A02/A03/A04/A05/A06/A08. Depois de A01, o replay remove APENAS o interceptor dentro da fixture, para alcançar os demais defeitos; esse contrafactual é identificado no script. Não foi alterado o frontend publicado.

O Chromium local deste executor não pôde ser instalado: o download retornou ZIP truncado. Os browsers foram executados em localhost no dispositivo autorizado, com a API integralmente interceptada e sem tráfego de teste autenticado para produção. Dois processos de build/browser na mesma VPS podem influenciar tempos; este ambiente não certifica SLOs de produção.
