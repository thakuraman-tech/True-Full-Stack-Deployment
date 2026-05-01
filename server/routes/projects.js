const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const projectController = require('../controllers/projectController');

// All project routes are protected
router.use(auth);

// @route   POST api/projects
// @desc    Create a project
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty()
  ],
  projectController.createProject
);

// @route   GET api/projects
// @desc    Get all projects user is part of
router.get('/', projectController.getProjects);

// @route   GET api/projects/:id
// @desc    Get project by ID
router.get('/:id', projectController.getProjectById);

// @route   PUT api/projects/:id
// @desc    Update project
router.put('/:id', projectController.updateProject);

// @route   DELETE api/projects/:id
// @desc    Delete project
router.delete('/:id', projectController.deleteProject);

// @route   POST api/projects/:id/members
// @desc    Add member to project
router.post(
  '/:id/members',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  projectController.addMember
);

// @route   DELETE api/projects/:id/members/:userId
// @desc    Remove member from project
router.delete('/:id/members/:userId', projectController.removeMember);

module.exports = router;
