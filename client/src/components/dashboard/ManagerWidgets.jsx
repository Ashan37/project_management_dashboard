export default function ManagerWidgets() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Widget title="My Projects" value="4" />
      <Widget title="Tasks In Review" value="7" />
      <Widget title="Upcoming Deadlines" value="3" />
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
