const router = require('express').Router();
const { calculateSplit } = require('../controllers/splitController');

router.get('/:groupId', calculateSplit);

module.exports = router;