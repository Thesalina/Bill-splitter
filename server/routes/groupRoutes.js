const express = require('express');
const router = require('express').Router();
const { createGroup, getAllGroups, getGroupById, updateGroup, deleteGroup } = require('../controllers/groupController');
const { validateGroup } = require('../middleware/validation');

router.post('/', validateGroup, createGroup);
router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.put('/:id', validateGroup, updateGroup);
router.delete('/:id', deleteGroup);

module.exports = router;