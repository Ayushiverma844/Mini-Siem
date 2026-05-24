function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-500/20 bg-black/30 backdrop-blur-xl px-8 py-5">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-bold">
            Security Dashboard
          </h2>

          <p className="text-gray-400 text-sm">
            Real-time threat monitoring system
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>

          <span className="text-emerald-400 font-medium">
            System Protected
          </span>

        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;