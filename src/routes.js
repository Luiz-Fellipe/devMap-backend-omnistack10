const { Router } = require('express');
const DevController = require('./controller/DevController');
const SearchController = require('./controller/SearchController');
const routes = Router();


routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.get('/search',SearchController.index);
routes.put('/update/:id', DevController.update);
routes.delete('/delete/:id', DevController.destroy);

module.exports = routes;