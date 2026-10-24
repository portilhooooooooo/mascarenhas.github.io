# Runtime V2 — contrato de migração

Estado: em execução, promoção bloqueada até gate M6. Mandato: R01–R08 e A01–A20/B01–B06 fornecidos pelo produto em 23/10/2026. React/TypeScript/Vite e Python preservados. UX, contratos, contagens, medianas e autorização permanecem autoritativos.

Identidade é validada por /api/me; navegação não autentica. 401 revoga acesso apenas para a geração que originou a requisição; 403 protege escopo; 503 conserva credencial sem autorizar ações. Eventos transportam cópias. Ownership React/legado explícito.

Estado de UI pertence ao módulo; rotas externas não redefinem subabas. Subabas visitadas permanecem montadas e ocultas ficam fora da árvore acessível. Consultas pertencem a identidade, geração, carteira, grants, contrato e filtros. Mesma chave conserva snapshot em refresh; chave diferente conserva geometria sem números anteriores. TTL inicial 45 s. Persistência analítica exige validação, esquema, TTL, limite e exclusão de detalhes sensíveis; não habilitar sem prova completa.

Marcos: M0 reprodução e baseline; M1 autenticação; M2 ciclo de vida; M3 consultas/restauração; M4 backend; M5 regressão/carga; M6 promoção expressa e observação de 2 horas. Qualquer cenário sem prova permanece NÃO EXECUTADO e impede GO.
