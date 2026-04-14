const Expense = require('../models/Expense');
const Member = require('../models/Member');

exports.calculateSplit = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Get all members and expenses in this group
    const members = await Member.find({ groupId });
    const expenses = await Expense.find({ groupId });

    if (members.length === 0)
      return res.status(404).json({ error: 'No members found in this group' });

    // Calculate total paid by each member
    const paid = {};
    members.forEach(m => paid[m._id.toString()] = { name: m.name, paid: 0 });
    expenses.forEach(e => {
      const id = e.paidBy.toString();
      if (paid[id]) paid[id].paid += e.amount;
    });

    // Calculate fair share
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const fairShare = total / members.length;

    // Calculate balance (positive = owed money, negative = owes money)
    const balances = Object.values(paid).map(m => ({
      name: m.name,
      balance: parseFloat((m.paid - fairShare).toFixed(2)),
    }));

    // Figure out who pays whom
    const settlements = [];
    const creditors = balances.filter(b => b.balance > 0);
    const debtors = balances.filter(b => b.balance < 0);

    debtors.forEach(debtor => {
      let owes = Math.abs(debtor.balance);
      creditors.forEach(creditor => {
        if (owes === 0 || creditor.balance === 0) return;
        const amount = Math.min(owes, creditor.balance);
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: parseFloat(amount.toFixed(2)),
        });
        owes -= amount;
        creditor.balance -= amount;
      });
    });

    res.json({
      totalExpenses: total,
      fairSharePerPerson: parseFloat(fairShare.toFixed(2)),
      balances,
      settlements,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};