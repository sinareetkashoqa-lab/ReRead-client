const Dashboard = ({ user }) => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.full_name || user?.username}!</p>
    </div>
  );
};

export default Dashboard;
