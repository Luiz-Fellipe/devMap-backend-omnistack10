const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');
//array para salvar as conexões dos usuários
const connections = [];

let io;

exports.setupWebsocket = (server) => {
 io = socketio(server);

 //toda vez que um usuário se conectar a minha aplicação usando protocolo websocket
 // eu receberei um objeto do tipo socket.
 io.on('connection', socket => {

  const { latitude, longitude, techs } = socket.handshake.query;

  connections.push({
   id: socket.id,
   coordinates: {
    latitude: Number(latitude),
    longitude: Number(longitude)
   },
   techs: parseStringAsArray(techs)
  })
 })
}

exports.findConnections = (coordinates, techs) => {
 return connections.filter(connection => {
  //verificando se a distancia do usuário conectado e menos de 10km do novo
  //usuário cadastrado e se as tecnologias são iguais
  return calculateDistance(coordinates, connection.coordinates) < 10
   && connection.techs.some(item => techs.includes(item))
 })
}

exports.sendMessage = (to, message, data) => {
 to.forEach(connection => {
  io.to(connection.id).emit(message, data);
 });
}