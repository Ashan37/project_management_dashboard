export default function AdminWidget() {
  return (
    <div>
      <Widget title="Total Projects" value="12" />
      <Widget title="Employees" value="32" />
      <Widget title="Clients" value="5" />
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
