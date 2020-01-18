const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

 //Tipos de parâmetros do express 
 //Query Params: req.query ( Filtros, ordenação, paginação ...)
 //Route Params: req.params (Indentificar um recurso na alteração ou remoção)
 //Body: req.body (Dados para criação ou alteração de um registro)

 // Req: é o que recebemos do cliente
 // Res: é o que enviamos ao cliente

 // listando os devs cadastrados
 async index(req, res) {
  const devs = await Dev.find();
  return res.json(devs);
 },

 // cadastrando dev no BD
 async store(req, res) {
  try {

   const { github_username, techs, latitude, longitude } = req.body;

   //verificando se o usuário ja existe no BD
   let dev = await Dev.findOne({ github_username });

   // se não existir cadastra.
   if (!dev) {

    const response = await axios.get(`https://api.github.com/users/${github_username}`);

    // name não e obrigado no github, caso o usuário não tenha ,cadastramos o login
    const { name = login, avatar_url, bio } = response.data;

    const techsArray = parseStringAsArray(techs);

    // preparando as coordenadas para cadastrar no BD
    const location = {
     type: 'Point',
     coordinates: [longitude, latitude],
    }

    //Cadastrando o dev no BD
    dev = await Dev.create({
     github_username,
     name,
     avatar_url,
     bio,
     techs: techsArray,
     location
    })

    // Filtrar as conexões que estão há no máximo 10 km de distancia 
    // e que o novo dev tenha pelo menos uma das tecnologias filtradas
    const sendSocketMessageTo = findConnections({ latitude, longitude }, techsArray);
    sendMessage(sendSocketMessageTo, 'new-dev', dev);
   }

   return res.json(dev);

  } catch (error) {
   console.log(error);
  }

 },

 // deletando um dev do BD
 async destroy(req, res) {

  await Dev.findByIdAndDelete(req.params.id);

  return res.send();
 },

 // atualizando informações do dev no BD
 async update(req, res) {
  const { techs, bio, name, latitude, longitude } = req.body;

  const arrayTechs = parseStringAsArray(techs);

  // preparando as coordenadas para cadastrar no BD
  const location = {
   type: 'Point',
   coordinates: [longitude, latitude],
  }

  const devUpdated = await Dev.findByIdAndUpdate(req.params.id, {
   name,
   bio,
   location,
   techs: arrayTechs
  }, { new: true })

  return res.json(devUpdated);
 }
}