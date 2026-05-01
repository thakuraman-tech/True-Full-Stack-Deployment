const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, projectId, assignedTo } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Check if user is an admin to create task
    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Only project admin can create tasks' });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user.id
    });

    const task = await newTask.save();
    
    // Emit socket event (to be handled in server.js)
    req.app.get('io').to(projectId.toString()).emit('task-created', task);

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ msg: 'Project ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Ensure user is part of project
    if (project.admin.toString() !== req.user.id && !project.members.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    let filter = { projectId };
    
    // Member sees only assigned tasks, Admin sees all
    if (project.admin.toString() !== req.user.id) {
      filter.assignedTo = req.user.id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', ['name', 'email'])
      .populate('createdBy', ['name']);
      
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const project = await Project.findById(task.projectId);
    
    const isAdmin = project.admin.toString() === req.user.id;
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isAdmin && !isAssigned) {
      return res.status(401).json({ msg: 'Not authorized to update this task' });
    }

    // Members can only update status
    if (!isAdmin) {
      if (status) task.status = status;
    } else {
      // Admin can update anything
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (priority) task.priority = priority;
      if (status) task.status = status;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
    }

    await task.save();
    
    // Emit socket event
    req.app.get('io').to(task.projectId.toString()).emit('task-updated', task);

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const project = await Project.findById(task.projectId);

    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Only project admin can delete tasks' });
    }

    const projectId = task.projectId;
    await task.deleteOne();

    req.app.get('io').to(projectId.toString()).emit('task-deleted', req.params.id);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
