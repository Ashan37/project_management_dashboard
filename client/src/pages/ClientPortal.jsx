import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProjects } from '../api/projectApi';
import { getMyTasks } from '../api/taskApi';
import { useAuthStore } from '../store/authStore';
import { createClientRequest, getMyClientRequests } from '../api/clientRequestApi';
import DiscussionThread from '../components/communication/DiscussionThread';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedProjectForDiscussion, setSelectedProjectForDiscussion] = useState(null);
  const [requestForm, setRequestForm] = useState({
    projectId: '',
    type: 'requirement',
    title: '',
    description: '',
    priority: 'medium'
  });
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes, requestsRes] = await Promise.all([
        getMyProjects(),
        getMyTasks().catch(() => ({ data: [] })),
        getMyClientRequests().catch(() => ({ data: [] }))
      ]);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClientRequest(requestForm);
      alert('Request submitted successfully!');
      setShowRequestForm(false);
      setRequestForm({
        projectId: '',
        type: 'requirement',
        title: '',
        description: '',
        priority: 'medium'
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request: ' + (error.response?.data?.message || error.message));
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 mx-auto max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-sm font-semibold text-gray-600">Total Projects</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{projects.length}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-sm font-semibold text-gray-600">Active Projects</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {projects.filter(p => p.status === 'in-progress').length}
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-sm font-semibold text-gray-600">Total Tasks</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{tasks.length}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-sm font-semibold text-gray-600">Avg Progress</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {projects.length > 0
                ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
                : 0}%
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowRequestForm(true)}
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            + Submit New Request / Change Request
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto border-b">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 font-semibold border-b-2 whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Projects & Milestones
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 font-semibold border-b-2 whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Tasks & Updates
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 font-semibold border-b-2 whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              My Requests
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'projects' && (
          <div className="bg-white shadow rounded-xl">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Your Projects & Milestones</h2>
            </div>
            <div className="p-6">
              {projects.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No projects assigned yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="p-4 transition-shadow border rounded-lg hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {project.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="mb-3 text-sm text-gray-600">
                            {project.description || 'No description'}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between mb-1 text-xs text-gray-600">
                              <span>Overall Progress</span>
                              <span>{project.progress || 0}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 transition-all bg-blue-600 rounded-full"
                                style={{ width: `${project.progress || 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Milestones */}
                          <div className="p-3 mb-3 rounded-lg bg-gray-50">
                            <h4 className="mb-2 text-sm font-semibold text-gray-700">📍 Milestones</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {project.startDate && (
                                <div>
                                  <span className="text-gray-600">Project Start: </span>
                                  <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {project.endDate && (
                                <div>
                                  <span className="text-gray-600">Target Completion: </span>
                                  <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-600">Status: </span>
                                <span className="font-medium capitalize">{project.status || 'planning'}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Progress: </span>
                                <span className="font-medium">{project.progress || 0}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Team Members */}
                          {project.teamMembers && project.teamMembers.length > 0 && (
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold">👥 Team: </span>
                              {project.teamMembers.map((member, idx) => (
                                <span key={member._id || idx}>
                                  {typeof member === 'object' ? member.name : member}
                                  {idx < project.teamMembers.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Discussion Button */}
                          <div className="mt-3">
                            <button
                              onClick={() => setSelectedProjectForDiscussion(project)}
                              className="px-4 py-2 text-sm font-medium text-white bg-[#82BAC4] rounded-lg hover:bg-[#6DA8B3] transition-colors"
                            >
                              💬 View Discussion
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-white shadow rounded-xl">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Tasks & Updates</h2>
            </div>
            <div className="p-6">
              {tasks.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No tasks available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 transition-shadow border rounded-lg hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTaskStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      {task.description && (
                        <p className="mb-2 text-sm text-gray-600">{task.description}</p>
                      )}
                      <div className="flex gap-4 text-xs text-gray-500">
                        {task.assignedTo && (
                          <span>
                            👤 Assigned to: {typeof task.assignedTo === 'object' ? task.assignedTo.name : 'Unassigned'}
                          </span>
                        )}
                        {task.dueDate && (
                          <span>
                            📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white shadow rounded-xl">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">My Requests & Change Requests</h2>
            </div>
            <div className="p-6">
              {requests.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No requests submitted yet</p>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Submit Your First Request
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request._id}
                      className="p-4 transition-shadow border rounded-lg hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-base font-semibold text-gray-900">
                              {request.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              request.type === 'requirement' ? 'bg-blue-100 text-blue-800' :
                              request.type === 'change' ? 'bg-purple-100 text-purple-800' :
                              request.type === 'bug' ? 'bg-red-100 text-red-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {request.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {request.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              request.status === 'implemented' ? 'bg-blue-100 text-blue-800' :
                              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              request.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                          <p className="mb-2 text-sm text-gray-600">{request.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span>📁 Project: {request.projectId?.name}</span>
                            <span>📅 Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {request.response && (
                            <div className="p-3 mt-3 rounded-lg bg-blue-50">
                              <p className="mb-1 text-xs font-semibold text-gray-700">Response from Team:</p>
                              <p className="text-sm text-gray-600">{request.response}</p>
                              {request.respondedBy && (
                                <p className="mt-1 text-xs text-gray-500">
                                  By {request.respondedBy.name} on {new Date(request.respondedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Discussion Modal */}
        {selectedProjectForDiscussion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-6 mx-4 bg-white rounded-lg max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProjectForDiscussion.name}</h2>
                  <p className="text-sm text-gray-600">Project Discussion</p>
                </div>
                <button
                  onClick={() => setSelectedProjectForDiscussion(null)}
                  className="px-4 py-2 text-gray-600 transition-colors bg-gray-200 rounded hover:bg-gray-300"
                >
                  ✕ Close
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <DiscussionThread projectId={selectedProjectForDiscussion._id} />
              </div>
            </div>
          </div>
        )}

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg">
              <h2 className="mb-4 text-2xl font-bold">Submit New Request</h2>
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold">Request Type</label>
                  <select
                    value={requestForm.type}
                    onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="requirement">New Requirement</option>
                    <option value="change">Change Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold">Related Project</label>
                  <select
                    value={requestForm.projectId}
                    onChange={(e) => setRequestForm({ ...requestForm, projectId: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold">Title</label>
                  <input
                    type="text"
                    value={requestForm.title}
                    onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Brief title for your request"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold">Description</label>
                  <textarea
                    value={requestForm.description}
                    onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows="4"
                    placeholder="Detailed description of your request"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold">Priority</label>
                  <select
                    value={requestForm.priority}
                    onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
