export default function StudentDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Profile Completion</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">85%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Active Applications</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Verified Skills</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">7</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pending Assessments</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
        <p className="text-gray-600">This is your centralized hub. Navigate through the sidebar to build your profile, track applications, and improve your skills.</p>
      </div>
    </div>
  );
}
