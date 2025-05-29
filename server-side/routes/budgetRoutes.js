const express = require('express');
const budgetController = require('../controllers/budgetController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticateToken, budgetController.createBudget); // Endpoint to create a new budgets
router.get('/', authenticateToken, budgetController.getBudgets); // Endpoint to get all budgets
router.put('/update', authenticateToken, budgetController.updateBudget); // Endpoint to update an existing budget
router.delete('/delete', authenticateToken, budgetController.deleteBudget);

module.exports = router;