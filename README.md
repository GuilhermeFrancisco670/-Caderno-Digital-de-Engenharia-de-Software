# Caderno Digital de Engenharia de Software

Um caderno digital estático para organizar atividades, trabalhos e exercícios do curso de Engenharia de Software. A interface foi construída com HTML, CSS e JavaScript nativos para continuar simples de abrir, editar e publicar no GitHub Pages.

## Recursos

A página permite criar, editar e excluir atividades com **Nome**, **Descrição**, **Matéria/Disciplina** e **Data** obrigatórios. Cada registro também pode receber um bloco de código opcional, com seleção de linguagem entre HTML, CSS, JavaScript, Python, Java, C/C++, C#, SQL e Outro.

As atividades são salvas automaticamente no `LocalStorage` do navegador. Para levar os dados para outro computador ou manter um backup, use **Exportar JSON**. O arquivo pode ser recuperado pelo botão **Importar**; itens incompletos são ignorados para preservar a estrutura dos registros.

Quando uma atividade possuir código, use o botão **Copiar** no cartão. Em seguida, cole o conteúdo com `Ctrl + V` em um arquivo do repositório ou diretamente no editor do GitHub. O botão de tema alterna entre os modos claro e escuro e memoriza a preferência no navegador.

## Sincronização gratuita com o GitHub

O botão **Sync GitHub** envia as atividades atuais para `activities-config.json` usando a [API oficial do GitHub](https://docs.github.com/en/rest/repos/contents). O fluxo lê a versão atual do arquivo, preserva o SHA necessário para atualização e cria um commit na branch escolhida. O uso da API para esse volume pessoal não tem custo adicional.

A sincronização acontece diretamente entre o navegador e `api.github.com`; este projeto não possui servidor intermediário. O token é usado apenas para autorizar a chamada ao GitHub. Por padrão, ele fica apenas na sessão atual do navegador. Se a opção **Lembrar o token neste navegador** for ativada, ele será armazenado no `LocalStorage`, o que é mais conveniente, porém menos seguro em computadores compartilhados.

### Como criar o token fine-grained

1. No GitHub, abra **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. Crie um novo token e, de preferência, defina uma expiração curta, como 30 dias.
3. Em **Resource owner**, selecione `GuilhermeFrancisco670`.
4. Em **Repository access**, escolha **Only select repositories** e selecione `-Caderno-Digital-de-Engenharia-de-Software`.
5. Em **Repository permissions**, conceda somente **Contents: Read and write**. A permissão **Metadata: Read-only** costuma ser adicionada automaticamente.
6. Gere o token e copie-o imediatamente; o GitHub não exibe o valor completo novamente.
7. No caderno, abra **Sync GitHub**, cole o token e revise proprietário, repositório, branch e arquivo de destino. Depois clique em **Salvar e sincronizar**.

Nunca publique o token no repositório, em uma imagem, em um arquivo JSON ou em mensagens. Se ele for exposto, revogue-o imediatamente nas configurações do GitHub e crie outro. Em computadores compartilhados, mantenha a opção de lembrar desmarcada e use **Limpar configuração** ao terminar.

### Destino padrão

```text
Proprietário: GuilhermeFrancisco670
Repositório: -Caderno-Digital-de-Engenharia-de-Software
Branch: main
Arquivo: activities-config.json
```

Cada sincronização gera um commit semelhante a `sync: atualizar caderno digital (AAAA-MM-DD)`. Se o arquivo, branch ou repositório não forem encontrados, o painel exibirá uma mensagem para correção. Se o GitHub informar falta de permissão, confira se o token pertence ao proprietário correto e possui **Contents: Read and write**.

## Como usar

Abra o arquivo `index.html` em um navegador ou publique o repositório com o GitHub Pages. Clique em **Nova atividade**, preencha os quatro campos obrigatórios e, se quiser, cole um código e escolha a linguagem. Depois de salvar, use a pesquisa, o filtro por disciplina, a edição, a exclusão, a exportação ou a sincronização conforme necessário.

Para usar a sincronização em um computador pessoal, recomenda-se publicar o projeto no **GitHub Pages**, que fornece HTTPS e facilita o uso contínuo da API. Também é possível executar localmente com um servidor estático, por exemplo `python3 -m http.server 4173`.

## Estrutura do registro

```json
{
  "id": "activity-001",
  "title": "Nome da atividade",
  "description": "Descrição do que foi estudado ou entregue.",
  "subject": "Engenharia de Software",
  "date": "2026-08-17",
  "code": "console.log('opcional');",
  "language": "javascript"
}
```

O arquivo exportado ou sincronizado usa o formato:

```json
{
  "version": 2,
  "exportedAt": "2026-08-17T12:00:00.000Z",
  "activities": []
}
```

## Publicação no GitHub Pages

Em **Settings → Pages**, selecione a branch principal e a pasta `/root`. O arquivo `index.html` será servido como página inicial do projeto.

## Licença

Este projeto permanece sob a licença BSD 3-Clause definida no arquivo `LICENSE`.
