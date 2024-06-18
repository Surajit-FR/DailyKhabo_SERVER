
const express = require('express');
const router = express.Router();
const RequestRate = require('../../helpers/request_limiter');
const TestController = require('../../controller/test/test.controller');


// Alter fields
router.get('/alter/fields', [RequestRate.Limiter], TestController.ModifyDBdata);


module.exports = router;