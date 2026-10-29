# MBA Backoffice — configuração visual Microsoft Entra
Data: 29/10/2026

## Objetivo
Personalizar EXCLUSIVAMENTE a autenticação Microsoft do MBA Backoffice, sem mudar o branding padrão de Outlook, Teams e outros aplicativos. O visual é derivado dos ativos reais do frontend do Mascarenhas Barbosa. Não cria uma página própria para senha/MFA.

## Pré-requisitos
- Tenant Microsoft Entra ID corporativo com licença P1 ou P2 para temas por aplicativo (preview em tenants de força de trabalho).
- Permissões: Organizational Branding Administrator e Application Administrator (ou equivalentes).
- Registro existente do aplicativo MBA Backoffice. Não criar outro app só para aplicar a marca.
- Verificar se o recurso Branding themes aparece no tenant; caso indisponível, NÃO alterar o branding padrão da organização.

## Caminho do painel
https://entra.microsoft.com
Entra ID > Identidade visual personalizada / Custom branding > Branding themes / Temas de identidade visual > Themes > Create new theme.

## Noções básicas / Basics
Nome do tema: MBA Backoffice — Mascarenhas
Apply theme to / Aplicar tema a: Add applications > selecione SOMENTE o registro do aplicativo OAuth que autentica o MBA Backoffice.
**Conferir o nome e Application (client) ID do registro existente; não está incluído neste pacote.**
Não marque Outlook, Teams, Microsoft 365 ou nenhuma outra aplicação.
Se o tema não for vinculado exclusivamente ao app, não concluir a publicação.

## Layout
Layout template / Modelo: Right-aligned / Alinhado à direita.
Show header / Mostrar cabeçalho: Sim, se disponível.
Header logo / Logotipo do cabeçalho: 02-logo-cabecalho-branco-245x36.png
Show footer / Mostrar rodapé: NÃO.
Se for exigido habilitar o rodapé para controlar os links, desmarque:
- Show Terms of Use / Mostrar Termos de Uso: NÃO.
- Show Privacy & Cookies / Mostrar Privacidade e Cookies: NÃO.
Não preencher URLs substitutas.

## Styling / Estilo
Background image / Imagem de plano de fundo: 01-fundo-mascarenhas-1920x1080.jpg
Page background color / Cor de fundo: #161617
Banner logo / Logotipo do formulário: 03-logo-formulario-escuro-245x36.png
Square logo light / Logotipo quadrado, tema claro: 04-logo-quadrado-tema-claro-240x240.png
Square logo dark / Logotipo quadrado, tema escuro: 05-logo-quadrado-tema-escuro-240x240.png
Favicon: 06-favicon-32x32.png
Custom CSS / CSS personalizado: NÃO utilizar.
Texto de login e dica de usuário: deixar em branco / manter padrão, se disponíveis.

## Testes antes de salvar
1. Preview / Visualizar; confirme fundo institucional, painel à direita, marca legível e rodapé oculto.
2. Review + Create / Revisar + Criar.
3. Em janela anônima, iniciar a autenticação a partir do próprio MBA Backoffice.
4. Verificar que o login do Backoffice usa o tema e que Outlook/Teams continuam sem alterações.
5. Testar desktop e mobile, fluxos com MFA e usuários convidados, se houver.

## Limitações importantes
- A animação/vídeo continua SOMENTE na página React do Backoffice. No login Microsoft só imagem de fundo estática.
- A caixa de login da Microsoft pode permanecer branca; não tentar forçar preto com CSS de posicionamento.
- A imagem é recortada responsivamente e o logotipo do banner pode variar com a etapa de autenticação.
- Dependendo de descoberta de tenant (home realm discovery), a primeira tela Microsoft pode ficar neutra até o usuário informar o e-mail corporativo.
- A visualização é uma simulação fiel ao estilo, não garante posição exata de todos os elementos.
- Algumas organizações têm regras de consentimento, licenciamento ou política interna adicionais. 
- Temas por aplicativo são preview em tenants Entra ID (outubro/2026) e aceitam até 5 temas por tenant conforme documentação.

## Links oficiais
https://learn.microsoft.com/pt-br/entra/fundamentals/how-to-customize-branding-themes-apps
https://learn.microsoft.com/pt-br/entra/fundamentals/how-to-customize-branding

## Conteúdo do ZIP
01–06: artes prontas para carregar; 07: prévia visual não enviada ao Entra; 08: manifesto automático de dimensões e tamanhos; este guia.
