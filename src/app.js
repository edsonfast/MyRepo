const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Middleware
function logResquests(req, res, next){
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`;
  
  console.time(logLabel);
      
  next(); //return next(); // Próximo Middleware

  console.timeEnd(logLabel);
}

function validateRepoId(req, res, next){
  const { id } = req.params;

  if(!isUuid(id)){
      return res.status(400).json({ error: 'Invalid repositorie ID.'});
  }

  return next();
}

app.use(logResquests);
app.use('/repositories/:id', validateRepoId);

app.get("/repositories", (request, response) => {
  // TODO
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // TODO
  const { title, url, techs } = request.body;

  const repo = {id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);

  return response.json(repo);

});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if (repoIndex < 0){
    return response.status(400).json({ error: "Repo Not Found!"});
  }

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if (repoIndex < 0){
    return response.status(400).json({ error: "Repo Not Found!"});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if (repoIndex < 0){
    return response.status(400).json({ error: "Repo Not Found!"});
  }

  const repo = repositories[repoIndex];
  
  repo.likes = repo.likes + 1;

  return response.json({ likes: repo.likes });

});

module.exports = app;
