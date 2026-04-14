const Member = require('../models/Member');

exports.addMember = async (req, res) => {
  try {
    const member = await Member.create({
      name: req.body.name,
      groupId: req.params.groupId,
    });
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMembersByGroup = async (req, res) => {
  try {
    const members = await Member.find({ groupId: req.params.groupId });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.memberId,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};