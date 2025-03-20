
const EmployerSkillSideBar = () => {
  return (
    <div className="w-full lg:w-64 mb-4 lg:mb-0">
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Skills</h2>
        <div className="mb-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
          </div> */}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-600">Construction</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-600">Electrician</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-600">Plumber</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-600">Painting</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EmployerSkillSideBar;
