const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getStats = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user.id }, { members: req.user.id }]
    });

    const projectIds = projects.map(p => p._id);

    let taskQuery = { projectId: { $in: projectIds } };
    
    // If not admin of projects, filter tasks they are assigned to
    // But for a dashboard, maybe we show stats for their assigned tasks + tasks in their projects if they are admin.
    // For simplicity, let's get all tasks they are assigned to OR they are admin of the project.
    
    const adminProjectIds = projects.filter(p => p.admin.toString() === req.user.id).map(p => p._id);
    
    taskQuery = {
      $or: [
        { projectId: { $in: adminProjectIds } },
        { assignedTo: req.user.id }
      ]
    };

    const tasks = await Task.find(taskQuery);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;

    // Chart Data: Status
    const tasksByStatus = [
      { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length },
      { name: 'In Progress', value: inProgressTasks },
      { name: 'Done', value: completedTasks }
    ];

    // Chart Data: Priority
    const tasksByPriority = [
      { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length },
      { name: 'High', value: tasks.filter(t => t.priority === 'High').length }
    ];

    res.json({
      cards: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks
      },
      charts: {
        tasksByStatus,
        tasksByPriority
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
