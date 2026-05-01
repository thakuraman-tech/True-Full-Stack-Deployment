const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Create new project with current user as admin
    const newProject = new Project({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id] // Admin is also a member
    });

    const project = await newProject.save();

    // Auto update user role if they were a member (Optional logic, let's just make sure they are admin of this project)
    await User.findByIdAndUpdate(req.user.id, { role: 'Admin' });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getProjects = async (req, res) => {
  try {
    // Return projects where user is either admin or member
    const projects = await Project.find({
      $or: [{ admin: req.user.id }, { members: req.user.id }]
    }).populate('admin', ['name', 'email']).populate('members', ['name', 'email']);
    
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', ['name', 'email'])
      .populate('members', ['name', 'email']);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Check if user is part of the project
    if (project.admin.toString() !== req.user.id && !project.members.some(member => member.id.toString() === req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Project not found' });
    res.status(500).send('Server Error');
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    // Ensure user is admin
    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized (Must be project admin)' });
    }

    if (name) project.name = name;
    if (description) project.description = description;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized (Must be project admin)' });
    }

    await project.deleteOne();
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Only project admin can add members' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (project.members.includes(userToAdd.id)) {
      return res.status(400).json({ msg: 'User is already a member' });
    }

    project.members.push(userToAdd.id);
    await project.save();

    const updatedProject = await Project.findById(req.params.id).populate('members', ['name', 'email']);
    res.json(updatedProject.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Only project admin can remove members' });
    }

    const userId = req.params.userId;
    
    if (project.admin.toString() === userId) {
      return res.status(400).json({ msg: 'Cannot remove the admin' });
    }

    project.members = project.members.filter(memberId => memberId.toString() !== userId);
    await project.save();

    res.json(project.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
