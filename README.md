# Tarefa 4.2: Mini-projeto - desenvolvimento do back-end
Tarefa 4.2 da unidade curricular Programação Web Avançada ano letivo 2019-2020. 

**Objetivo**: criar o back-end para duas novas entidades da API  http://fcawebbook.herokuapp.com/:
- Voluntários
- Membros do Comité

**Notas**
- Foi desativado o back-end com a BD e substituídos os dados por ficheiros JSON para simular as tabelas das BD
- As funções foram todas rescritas para ler/escrever os ficheiros JSON referidos no ponto anterior. Ver a pasta `tabelas/`
- Foram também criadas funções auxiliares para encontrar uma conferência, um membro do comité, um voluntário por id e para descobrir se os dados a inserir nas "tabelas" relacionais conf_volunteers e conf_committee já existem e assim evitar duplicação de dados
- A coleção Postman para esta tarefa estão na pasta 'postman', que contém a informação para inserir/atualizar/apagar/obter membros do comité, inserir/apagar/obter membros do comitém em conferências, inserir/atualizar/apagar/obter voluntários, inserir/apagar/obter voluntários em conferências
- Para este exercício, foram criados os ficheiros `controllers/committee.controller.js`, `controllers/volunteers.controller.js` e modificado o já existente `controllers/conference.controller.js`
- Foi criada uma mensagem de erro extra para quando existe duplicação de dados (`jsonMessages.db.duplicateData`)

### Instalação
```shell script
git clone git@github.com:a-santo/mini-proj3.git
cd mini-proj3
npm install
node server.js
```
... caso tudo instale corretamente e o servidor inicie sem problemas, podem ser feitas chamadas API para http://localhost:8080

### Créditos

**Elaborado por**: André Santo

**Professor**: Ricardo Baptista

**Baseado nos exercícios do seguinte manual**:

_Introdução ao Desenvolvimento Moderno para a Web - do front-end ao back-end: uma visão global!. 1ª edição, FCA, ISBN: 978-972-722-897-3, Filipe Portela, Ricardo Queirós (2018)_