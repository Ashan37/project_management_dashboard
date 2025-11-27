import { assignTeam } from "../../api/projectApi";
import { useState, useEffect } from "react";
import instance from "../../api/axiosConfig";

export default function AssignTeam({ project, refresh }) {
  const [team, setTeam] = useState(
    project.teamMembers?.map(member => typeof member === 'object' ? member._id : member) || []
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'manager':
        return 'Project Manager';
      case 'employee':
        return 'Employee';
      case 'client':
        return 'Client';
      default:
        return role;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await instance.get('/users');
      // Filter out clients, only show employees, managers, and admins
      const filteredUsers = res.data.filter(user => 
        user.role !== 'client'
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setTeam([...team, ""]);
  };

  const handleChange = (index, value) => {
    const updated = [...team];
    updated[index] = value;
    setTeam(updated);
  };

  const handleRemove = (index) => {
    const updated = team.filter((_, i) => i !== index);
    setTeam(updated);
  };

  const handleSave = async () => {
    try {
      // Filter out empty values
      const validTeam = team.filter(id => id && id.trim() !== '');
      await assignTeam(project._id, validTeam);
      alert("Team assigned successfully!");
      refresh();
    } catch (error) {
      console.error("Error assigning team:", error);
      alert("Failed to assign team: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="p-6 mt-6 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-bold">Assign Team</h2>
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6 mt-6 bg-white shadow rounded-xl">
      <h2 className="mb-4 text-xl font-bold">Assign Team Members</h2>

      <div className="mb-4 space-y-3">
        {team.map((memberId, i) => (
          <div key={i} className="flex gap-2">
            <select
              className="flex-1 p-2 border rounded"
              value={memberId}
              onChange={(e) => handleChange(i, e.target.value)}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email}) - {getRoleLabel(user.role)}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleRemove(i)}
              className="px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          + Add Member
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 text-white bg-[#82BAC4] rounded hover:bg-[#6DA8B3]"
        >
          Save Team
        </button>
      </div>
    </div>
  );
}
