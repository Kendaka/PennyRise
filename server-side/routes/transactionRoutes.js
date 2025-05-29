const express = require('express');
const transactionController = require('../controllers/transactionController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticateToken, transactionController.createTransaction); // Endpoint to create a new transaction
router.get('/', authenticateToken, transactionController.getTransactions); //  Endpoint to get all transactions
router.delete('/delete', authenticateToken, transactionController.deleteTransaction);

module.exports = router;