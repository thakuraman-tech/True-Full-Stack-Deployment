const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

router.use(auth);

// @route   POST api/tasks
// @desc    Create a task
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('projectId', 'Project ID is required').not().isEmpty()
  ],
  taskController.createTask
);

// @route   GET api/tasks
// @desc    Get tasks for a project
router.get('/', taskController.getTasks);

// @route   PUT api/tasks/:id
// @desc    Update task
router.put('/:id', taskController.updateTask);

// @route   DELETE api/tasks/:id
// @desc    Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
