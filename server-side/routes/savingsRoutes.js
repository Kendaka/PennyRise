const express = require('express');
const savingsController = require('../controllers/savingsController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticateToken, savingsController.createSavingsGoal);
router.get('/', authenticateToken, savingsController.getSavingsGoals);
router.put('/update', authenticateToken, savingsController.updateSavingsGoal);
router.delete('/delete', authenticateToken, savingsController.deleteSavingsGoal);

module.exports = router;