import { assignTeam } from "../../api/projectApi";
import { useState } from "react";

export default function AssignTeam({ project, refresh }) {
  const [team, setTeam] = useState(project.team || []);

  const handleAdd = () => {
    setTeam([...team, ""]);
  };

  const handleChange = (index, value) => {
    const updated = [...team];
    updated[index] = value;
    setTeam(updated);
  };

  const handleSave = async () => {
    await assignTeam(project._id, team);
    refresh();
  };

  return (
    <div className="p-6 mt-6 bg-white shadow rounded-xl">
      <h2 className="mb-4 text-xl font-bold">Assign Team</h2>

      {team.map((member, i) => (
        <input
          key={i}
          className="w-full p-2 mb-3 border rounded"
          value={member}
          onChange={(e) => handleChange(i, e.target.value)}
        />
      ))}

      <button
        onClick={handleAdd}
        className="px-3 py-2 mr-3 bg-gray-300 rounded"
      >
        + Add Member
      </button>

      <button
        onClick={handleSave}
        className="px-4 py-2 text-white bg-blue-600 rounded"
      >
        Save Team
      </button>
    </div>
  );
}
