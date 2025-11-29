import { useState, useEffect } from "react";
import { getAllClientRequests } from "../../api/clientRequestApi";

export default function ClientRequestsWidget() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0,
    implemented: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAllClientRequests();
      const requests = res.data;

      setStats({
        total: requests.length,
        pending: requests.filter((r) => r.status === "pending").length,
        reviewed: requests.filter((r) => r.status === "reviewed").length,
        approved: requests.filter((r) => r.status === "approved").length,
        rejected: requests.filter((r) => r.status === "rejected").length,
        implemented: requests.filter((r) => r.status === "implemented").length,
      });
    } catch (error) {
      console.error("Error fetching client request stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white shadow rounded-xl">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h3 className="mb-4 text-lg font-semibold">Client Requests</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Requests</span>
          <span className="font-bold text-[#82BAC4]">{stats.total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pending</span>
          <span className="font-semibold text-yellow-600">{stats.pending}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Reviewed</span>
          <span className="font-semibold text-blue-600">{stats.reviewed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Approved</span>
          <span className="font-semibold text-green-600">{stats.approved}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Implemented</span>
          <span className="font-semibold text-purple-600">
            {stats.implemented}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Rejected</span>
          <span className="font-semibold text-red-600">{stats.rejected}</span>
        </div>
      </div>
    </div>
  );
}
