const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
});

MemberSchema.index({ groupId: 1 });

module.exports = mongoose.model('Member', MemberSchema);