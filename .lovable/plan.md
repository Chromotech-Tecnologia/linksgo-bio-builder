

## Plano: Banners com Imagens nos Templates de Negócios

### Problema Atual
Os banners do template "Negócios" usam apenas gradientes coloridos. A imagem de referência mostra banners com **imagens de fundo reais** (fotos de comida, produtos, etc.) com texto sobreposto — um visual muito mais atrativo para negócios.

### O que será feito

**1. Adicionar coluna `banner_image_url` na tabela `project_links`**
- Nova coluna `text nullable` para armazenar a URL da imagem de banner de cada link
- Sem necessidade de RLS adicional (já coberta pelas policies existentes)

**2. Atualizar o `ProjectLinksEditor` com upload de imagem por link**
- No dialog de adicionar/editar link, incluir um campo de upload de imagem (usando `FileUploader` existente)
- A imagem será salva no bucket `projects` (já existe e é público)
- O campo `bannerImageUrl` será adicionado ao estado do link

**3. Atualizar o `BannerCardTemplate` para exibir as imagens como fundo**
- Quando o link tiver `banner_image_url`, a imagem ocupa o fundo inteiro do banner (não mais 30% de opacidade)
- Texto sobreposto com sombra para legibilidade
- Manter gradiente como fallback quando não houver imagem

**4. Atualizar o fluxo de salvamento**
- `ProjectWizard.tsx` e `ProjectEdit.tsx` precisam salvar/carregar o `banner_image_url` nos links

### Fluxo do Usuário
1. Cria projeto com template de Negócios
2. No passo "Links", adiciona um link e faz upload de uma imagem de banner
3. O banner aparece com a imagem de fundo + texto sobreposto
4. Na página pública, cada link é exibido como um banner visual com a imagem

### Arquivos Modificados
- **Migration SQL**: Adicionar `banner_image_url` em `project_links`
- **`ProjectLinksEditor.tsx`**: Adicionar campo de upload de imagem no dialog
- **`BannerCardTemplate.tsx`**: Renderizar imagem de fundo em tela cheia no banner
- **`ProjectWizard.tsx`**: Incluir `bannerImageUrl` no estado e salvamento dos links
- **`ProjectEdit.tsx`**: Incluir `bannerImageUrl` no carregamento e salvamento dos links

