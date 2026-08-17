# Caderno Digital de Engenharia de Software

Um caderno digital estático para organizar atividades, trabalhos e exercícios do curso de Engenharia de Software. A interface foi construída com HTML, CSS e JavaScript nativos para continuar simples de abrir, editar e publicar no GitHub Pages.

## Recursos

A página permite criar, editar e excluir atividades com **Nome**, **Descrição**, **Matéria/Disciplina** e **Data** obrigatórios. Cada registro também pode receber um bloco de código opcional, com seleção de linguagem entre HTML, CSS, JavaScript, Python, Java, C/C++, C#, SQL e Outro.

As atividades são salvas automaticamente no `LocalStorage` do navegador. Para levar os dados para outro computador ou manter um backup, use **Exportar JSON**. O arquivo pode ser recuperado pelo botão **Importar**; itens incompletos são ignorados para preservar a estrutura dos registros.

Quando uma atividade possuir código, use o botão **Copiar** no cartão. Em seguida, cole o conteúdo com `Ctrl + V` em um arquivo do repositório ou diretamente no editor do GitHub. O botão de tema alterna entre os modos claro e escuro e memoriza a preferência no navegador.

## Como usar

Abra o arquivo `index.html` em um navegador ou publique o repositório com o GitHub Pages. Clique em **Nova atividade**, preencha os quatro campos obrigatórios e, se quiser, cole um código e escolha a linguagem. Depois de salvar, use a pesquisa, o filtro por disciplina, a edição, a exclusão e a exportação conforme necessário.

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

## Publicação no GitHub Pages

Em **Settings → Pages**, selecione a branch principal e a pasta `/root`. O arquivo `index.html` será servido como página inicial do projeto.

## Licença

Este projeto permanece sob a licença BSD 3-Clause definida no arquivo `LICENSE`.
