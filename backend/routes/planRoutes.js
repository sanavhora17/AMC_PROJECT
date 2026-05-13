const express = require('express');
const router = express.Router();
const { createPlan, getPlans, updatePlan, deletePlan } = require('../controllers/planController');

router.post('/add', createPlan);
router.get('/all', getPlans);
router.put('/:id', updatePlan);    // Edit ke liye
router.delete('/:id', deletePlan); // Delete ke liye

module.exports = router;