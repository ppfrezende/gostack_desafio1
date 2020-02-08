const express = require('express');

const server = express();

server.use(express.json());

//-----------------------------------------------------------------------------------------------

// Query Params = ?teste=1
// Route Params = /users/1
// Request Body = { "name": "Fellipe", etc }

// CRUD = Create, Read, Update, Delete
//-----------------------------------------------------------------------------------------------

const projects = [];

// MIDDLEWARES GLOBAIS

// Este Middleware retorna o log do número de requisições
function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}
server.use(logRequests);

// MIDDLEWARES LOCAIS

// Este Middleware checa se o projeto com tal ID existe, e será utilizado em TODAS as ROTAS
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

// Este Middleware que impede a criação de dois projetos com mesmo ID
function checkIdInUse(req, res, next) {
  const { id } = req.body;

  const projectId = projects.findIndex(p => p.id == id);
  if(projectId != -1) {
    return res.status(409).json({ error: 'ID is already being used' });
  }
  return next();
}

//-----------------------------------------------------------------------------------------------

// Cadastro de um novo projeto.
// Request body: { id, tittle }.

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  }
  project.push(project);
  
  return res.json(project);
})

// Retorna todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
})

// Altera apenas o título do projeto com o ID presente nos parâmetros da ROTA.
// Mid = checkProjectExists
// Route Params = /projects/1 (ID)
// Request Body = { "title": }
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(project);
})

// Deleta o projeto com o ID presente nos parâmetros da ROTA.
// Mid = checkProjectExists
// Route Params = /projects/1 (ID)
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);
  projects.slice(projectIndex, 1);

  return res.send();
})

// Recebe um campo TITLE e armazena uma nova tarefa no array de tasks de um projeto específico escolhido através do ID presente nos parâmetros da ROTA;
// Mid = checkProjectExists
// Route Params = /projects/1 (ID)
// Request Body = { "title": }
server.post('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.json(project)
})

server.listen(3000);