export default function EmployeeWidgets() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Widget title="My Tasks" value="10" />
      <Widget title="Due Today" value="2" />
      <Widget title="Completed" value="14" />
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
