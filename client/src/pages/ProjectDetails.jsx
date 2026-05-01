import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { io } from 'socket.io-client';
import TaskBoard from '../components/TaskBoard';
import TaskModal from '../components/TaskModal';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { Plus, Users } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjectData();

    // Socket.io setup
    const socket = io('http://localhost:5000'); // Note: should use env var in prod
    socket.emit('join-project', id);

    socket.on('task-created', (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on('task-updated', (updatedTask) => {
      setTasks((prev) => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    });

    socket.on('task-deleted', (taskId) => {
      setTasks((prev) => prev.filter(t => t._id !== taskId));
    });

    return () => {
      socket.emit('leave-project', id);
      socket.disconnect();
    };
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', { ...taskData, projectId: id });
      // Socket handles state update
      setShowTaskModal(false);
      toast.success('Task created');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updateData) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, updateData);
      // Socket handles state update
      if (showTaskModal) setShowTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to delete task');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div></div>;
  }

  const isAdmin = project?.admin._id === user?._id || project?.admin === user?._id;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{project?.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">{project?.description}</p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex -space-x-2">
              {project?.members?.slice(0, 5).map((member, i) => (
                <div key={member._id} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-dark-bg" title={member.name}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {project?.members?.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 border-2 border-white dark:border-dark-bg">
                  +{project.members.length - 5}
                </div>
              )}
            </div>
            {isAdmin && (
              <button className="text-sm flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 px-3 py-1.5 rounded-full transition-colors font-medium">
                <Users size={14} />
                <span>Manage Team</span>
              </button>
            )}
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover-scale font-medium"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        )}
      </div>

      <div className="flex-1 min-h-[500px]">
        <TaskBoard 
          tasks={tasks} 
          onUpdateTask={handleUpdateTask} 
          onDeleteTask={handleDeleteTask} 
          onEditTask={openEditModal}
          isAdmin={isAdmin}
          members={project?.members || []}
        />
      </div>

      {showTaskModal && (
        <TaskModal 
          task={editingTask}
          members={project?.members || []}
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
          onSubmit={editingTask ? (data) => handleUpdateTask(editingTask._id, data) : handleCreateTask}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
