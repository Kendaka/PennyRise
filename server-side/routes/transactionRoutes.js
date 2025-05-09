const express = require('express');
const transactionController = require('../controllers/transactionController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticateToken, transactionController.createTransaction);
router.get('/', authenticateToken, transactionController.getTransactions);
router.delete('/delete', authenticateToken, transactionController.deleteTransaction);

module.exports = router;