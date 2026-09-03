const AdminDashboard = ({ user }) => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.full_name || user?.username}!</p>
    </div>
  );
};

export default AdminDashboard;
