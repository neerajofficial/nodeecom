const express = require('express');

const errorControllers = require('./../controllers/error');

const router = express.Router();

router.use(errorControllers.get404);

module.exports = router;