// src/routes/principalRoutes.js
const express = require('express');
const router = express.Router();
const principalController = require('../controller/principalController');



router.get('/', principalController.getPrincipal);      

module.exports = router;

