export default function ClientWidgets() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Widget title="Project Progress" value="72%" />
      <Widget title="Milestones" value="5" />
      <Widget title="Change Requests" value="1 Pending" />
    </div>
  );
}

function Widget({ title, value }) {
  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
