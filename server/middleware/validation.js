const validate = (schema) => (req, res, next) => {
  const errors = [];

  if (schema.name && (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim() === '')) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (schema.amount && (req.body.amount === undefined || typeof req.body.amount !== 'number' || req.body.amount < 0)) {
    errors.push('Amount is required and must be a non-negative number');
  }

  if (schema.paidBy && (!req.body.paidBy || !/^[0-9a-fA-F]{24}$/.test(req.body.paidBy))) {
    errors.push('Valid paidBy (member ID) is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const groupSchema = { name: true };
const memberSchema = { name: true };
const expenseSchema = { description: true, amount: true, paidBy: true };

module.exports = {
  validateGroup: validate(groupSchema),
  validateMember: validate(memberSchema),
  validateExpense: validate(expenseSchema),
};
