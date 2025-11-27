import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getMyTasks, updateTaskStatus } from '../api/taskApi';
import { useAuthStore } from '../store/authStore';
import TaskModal from '../components/tasks/TaskModal';

const STATUSES = ["To Do", "In Progress", "In Review", "Completed"];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { role, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getMyTasks();
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to load tasks: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus, event) => {
    // Prevent event bubbling to avoid opening modal when changing status
    if (event) {
      event.stopPropagation();
    }
    
    try {
      await updateTaskStatus(taskId, newStatus);
      // Update local state
      setTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
    // Refresh tasks after closing modal
    fetchTasks();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (dueDate) => {
    if (!dueDate) return 'text-gray-500';
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return 'text-red-600 font-semibold'; // Overdue
    if (daysUntilDue <= 2) return 'text-orange-600 font-semibold'; // Due soon
    return 'text-gray-600';
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'To Do').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    inReview: tasks.filter(t => t.status === 'In Review').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-500">Loading tasks...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">All Tasks</h1>
          <p className="text-sm text-gray-500">Total: {tasks.length} tasks loaded</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-5">
          <div
            onClick={() => setFilter('all')}
            className={`p-4 bg-white rounded-lg shadow cursor-pointer transition ${
              filter === 'all' ? 'ring-2 ring-[#82BAC4]' : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-sm text-gray-600">Total Tasks</h3>
            <p className="text-2xl font-bold text-[#82BAC4]">{taskStats.total}</p>
          </div>
          <div
            onClick={() => setFilter('To Do')}
            className={`p-4 bg-white rounded-lg shadow cursor-pointer transition ${
              filter === 'To Do' ? 'ring-2 ring-gray-500' : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-sm text-gray-600">To Do</h3>
            <p className="text-2xl font-bold text-gray-600">{taskStats.todo}</p>
          </div>
          <div
            onClick={() => setFilter('In Progress')}
            className={`p-4 bg-white rounded-lg shadow cursor-pointer transition ${
              filter === 'In Progress' ? 'ring-2 ring-[#82BAC4]' : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-sm text-gray-600">In Progress</h3>
            <p className="text-2xl font-bold text-[#82BAC4]">{taskStats.inProgress}</p>
          </div>
          <div
            onClick={() => setFilter('In Review')}
            className={`p-4 bg-white rounded-lg shadow cursor-pointer transition ${
              filter === 'In Review' ? 'ring-2 ring-yellow-500' : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-sm text-gray-600">In Review</h3>
            <p className="text-2xl font-bold text-yellow-600">{taskStats.inReview}</p>
          </div>
          <div
            onClick={() => setFilter('Completed')}
            className={`p-4 bg-white rounded-lg shadow cursor-pointer transition ${
              filter === 'Completed' ? 'ring-2 ring-green-500' : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-sm text-gray-600">Completed</h3>
            <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">
              {filter === 'all' ? 'All Tasks' : `${filter} Tasks`} ({filteredTasks.length})
            </h2>
          </div>
          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  {filter === 'all' ? 'No tasks available' : `No ${filter.toLowerCase()} tasks`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => handleTaskClick(task)}
                    className="p-4 transition-shadow border rounded-lg cursor-pointer hover:shadow-md hover:border-blue-400"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          
                          {/* Status Dropdown - Allow employees to change their own task status */}
                          {(role === 'employee' && task.assignedTo?._id === user?._id) || role === 'admin' || role === 'manager' ? (
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task._id, e.target.value, e)}
                              onClick={(e) => e.stopPropagation()}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(task.status)}`}
                            >
                              {STATUSES.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="mb-3 text-sm text-gray-600">{task.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          {task.project && (
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">Project:</span>
                              <span>{typeof task.project === 'object' ? task.project.name : 'N/A'}</span>
                            </div>
                          )}
                          {task.assignedTo && (
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">Assigned:</span>
                              <span>{typeof task.assignedTo === 'object' ? task.assignedTo.name : 'Unassigned'}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">Priority:</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              task.priority === "urgent" ? "bg-red-100 text-red-800" :
                              task.priority === "high" ? "bg-orange-100 text-orange-800" :
                              task.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }`}>
                              {task.priority?.toUpperCase() || "MEDIUM"}
                            </span>
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">Due:</span>
                              <span className={getPriorityColor(task.dueDate)}>
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Subtasks Progress */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between mb-1 text-xs text-gray-600">
                              <span>Subtasks</span>
                              <span>
                                {task.subtasks.filter(st => st.isCompleted).length} / {task.subtasks.length} completed
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full">
                              <div
                                className="h-1.5 bg-[#82BAC4] rounded-full transition-all"
                                style={{
                                  width: `${(task.subtasks.filter(st => st.isCompleted).length / task.subtasks.length) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {task.project && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/projects/${task.project._id}/kanban`);
                          }}
                          className="px-3 py-1 ml-4 text-sm text-white bg-[#82BAC4] rounded hover:bg-[#6DA8B3]"
                        >
                          View Board
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          open={openModal}
          close={handleCloseModal}
          task={selectedTask}
        />
      )}
    </DashboardLayout>
  );
}
