import { useState, useEffect } from 'react';
import { getAllClientRequests, updateClientRequestStatus, deleteClientRequest } from '../api/clientRequestApi';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';

export default function ClientRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const { role } = useAuthStore();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllClientRequests();
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      await updateClientRequestStatus(selectedRequest._id, { status, response });
      alert('Request updated successfully');
      setSelectedRequest(null);
      setResponse('');
      setStatus('');
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await deleteClientRequest(requestId);
      alert('Request deleted successfully');
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'implemented': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'requirement': return 'bg-blue-100 text-blue-800';
      case 'change': return 'bg-purple-100 text-purple-800';
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feature': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (filterType !== 'all' && req.type !== filterType) return false;
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">Client Requests</h1>
            <p className="text-sm text-gray-600">
              Total: {requests.length} | Pending: {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="implemented">Implemented</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="requirement">Requirement</option>
              <option value="change">Change</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden bg-white shadow rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">
                    Client
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">
                    Project
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">
                    Type
                  </th>
                  <th className="hidden px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell md:px-6">
                    Title
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">
                    Status
                  </th>
                  <th className="hidden px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell md:px-6">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm md:px-6">
                        <div className="font-medium text-gray-900">{request.client?.name}</div>
                        <div className="hidden text-gray-500 md:block">{request.client?.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm md:px-6">
                        {request.projectId?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm md:px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}>
                          {request.type}
                        </span>
                      </td>
                      <td className="hidden px-4 py-4 text-sm text-gray-900 md:table-cell md:px-6">
                        {request.title}
                      </td>
                      <td className="px-4 py-4 text-sm md:px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm md:px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="hidden px-4 py-4 text-sm text-gray-500 md:table-cell md:px-6">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm md:px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setStatus(request.status);
                              setResponse(request.response || '');
                            }}
                            className="text-[#82BAC4] hover:text-[#6DA8B3] font-medium"
                          >
                            View
                          </button>
                          {role === 'admin' && (
                            <button
                              onClick={() => handleDeleteRequest(request._id)}
                              className="font-medium text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Response Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Request Details</h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Client</p>
                      <p className="text-gray-900">{selectedRequest.client?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Project</p>
                      <p className="text-gray-900">{selectedRequest.projectId?.name}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Type</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedRequest.type)}`}>
                        {selectedRequest.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Priority</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                        {selectedRequest.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Title</p>
                    <p className="text-gray-900">{selectedRequest.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Description</p>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedRequest.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Submitted</p>
                    <p className="text-gray-600">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>

                  {selectedRequest.response && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="mb-1 text-sm font-semibold text-gray-700">Previous Response</p>
                      <p className="text-gray-600">{selectedRequest.response}</p>
                      {selectedRequest.respondedBy && (
                        <p className="mt-2 text-xs text-gray-500">
                          By {selectedRequest.respondedBy.name} on {new Date(selectedRequest.respondedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h3 className="mb-4 text-lg font-semibold">Update Request</h3>
                  
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#82BAC4] focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="implemented">Implemented</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Response</label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#82BAC4] focus:border-transparent"
                      rows="4"
                      placeholder="Your response to the client..."
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateRequest}
                      className="px-4 py-2 text-white bg-[#82BAC4] rounded-lg hover:bg-[#6DA8B3]"
                    >
                      Submit Response
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
