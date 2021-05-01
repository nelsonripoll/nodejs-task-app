const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth.js');
const controller = require('../controllers/task.js');

router.post('/tasks', auth, controller.createTask);
router.get('/tasks', auth, controller.readAllTasks);
router.get('/tasks/:id', auth, controller.readTask);
router.patch('/tasks/:id', auth, controller.updateTask);
router.delete('/tasks/:id', auth, controller.deleteTask);

module.exports = router;
