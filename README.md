# Tarefa 4.2: Mini-projeto - desenvolvimento do back-end
Tarefa 4.2 da unidade curricular Programação Web Avançada ano letivo 2019-2020. 

**Objetivo**: criar o back-end para duas novas entidades da API  http://fcawebbook.herokuapp.com/:
- Voluntários
- Membros do Comité

**Notas**
- Todas as tabelas (incluindo a estrutura original) estão na pasta 'tabelas'
- Caso seja utilizado um servidor para além do que está configurado nos ficheiros 'config/config.json' e 'config/connectMySQL', será necessário criar a estrutura das tabelas referidas no ponto anterior
- A coleção Postman para esta tarefa estão na pasta 'postman', que contém a informação para inserir/atualizar/apagar/obter membros do comité, inserir/apagar/obter membros do comitém em conferências, inserir/atualizar/apagar/obter voluntários, inserir/apagar/obter voluntários em conferências
- O código para interagir com as end-points está comentado nos respetivos ficheiros .js (committee.js e volunteers.js)

### Instalação
```shell script
git clone git@github.com:a-santo/mini-proj3.git
cd mini-proj3
npm install
node server.js
```
... caso tudo instale corretamente e o servidor inicie sem problemas, podem ser feitas chamadas API para http://localhost:8080

### Créditos

Elaborado por: André Santo

Professor: Ricardo Baptista

Baseado nos exercícios de seguinte manual:

Introdução ao Desenvolvimento Moderno para a Web - do front-end ao back-end: uma visão global!. 1ª edição, FCA, ISBN: 978-972-722-897-3, Filipe Portela, Ricardo Queirós (2018)