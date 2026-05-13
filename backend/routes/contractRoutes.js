const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');

router.get('/contracts', contractController.getAdminContracts);
router.post('/buy', contractController.buyContract);
router.get('/user/:userId', contractController.getUserContracts);
router.delete('/contracts/:id', contractController.deleteContract);

module.exports = router;