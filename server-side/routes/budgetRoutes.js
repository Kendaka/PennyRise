const express = require('express');
const budgetController = require('../controllers/budgetController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticateToken, budgetController.createBudget);
router.get('/', authenticateToken, budgetController.getBudgets);
router.put('/update', authenticateToken, budgetController.updateBudget);
router.delete('/delete', authenticateToken, budgetController.deleteBudget);

module.exports = router;