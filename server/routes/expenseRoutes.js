const router = require('express').Router();
const { addExpense, getExpensesByGroup, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { validateExpense } = require('../middleware/validation');

router.post('/:groupId', validateExpense, addExpense);
router.get('/:groupId', getExpensesByGroup);
router.put('/:expenseId', validateExpense, updateExpense);
router.delete('/:expenseId', deleteExpense);

module.exports = router;