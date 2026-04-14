const router = require('express').Router();
const { addMember, getMembersByGroup, updateMember, deleteMember } = require('../controllers/memberController');
const { validateMember } = require('../middleware/validation');

router.post('/:groupId', validateMember, addMember);
router.get('/:groupId', getMembersByGroup);
router.put('/:memberId', validateMember, updateMember);
router.delete('/:memberId', deleteMember);

module.exports = router;