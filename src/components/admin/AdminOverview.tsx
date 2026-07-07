interface AdminOverviewProps {
  totalWorks: number;
  activeServices: number;
  testimonials: number;
  categories: { label: string; count?: number }[];
}

export default function AdminOverview({
  totalWorks,
  activeServices,
  testimonials,
  categories,
}: AdminOverviewProps) {
  const stats = [
    { label: "Total Works", value: String(totalWorks), change: "From CMS" },
    { label: "Total Orders", value: "-", change: "Order tracking not enabled" },
    { label: "Active Plans", value: String(activeServices), change: "From CMS" },
    { label: "Testimonials", value: String(testimonials), change: "From CMS" },
  ];
  const maxCount = Math.max(...categories.map((category) => category.count || 0), 1);

  return (
    <div className="space-y-8">
      <div className="surface-panel rounded-[2rem] p-8 sm:p-10">
        <p className="section-kicker mb-4">Dashboard</p>
        <h1 className="section-title text-4xl sm:text-5xl">Dashboard Overview</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9aa7b9]">
          A live snapshot of the content currently powering the public site.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="surface-panel rounded-[1.75rem] p-6 transition-transform hover:-translate-y-1"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9aa7b9]">{stat.label}</p>
            <p className="mt-4 text-4xl font-bold text-white">{stat.value}</p>
            <p className="mt-3 text-sm text-[#7dd3c7]">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="surface-panel rounded-[1.75rem] p-6">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[#9aa7b9]">
              <p className="mb-1 font-semibold text-white">
                CMS data is connected
              </p>
              <p>Use the admin sections to manage live content.</p>
            </div>
          </div>
        </div>

        <div className="surface-panel rounded-[1.75rem] p-6">
          <h2 className="text-xl font-semibold text-white">Portfolio Breakdown</h2>
          <div className="space-y-4">
            {categories.map((category) => {
              const count = category.count || 0;
              return (
                <div key={category.label}>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-[#9aa7b9]">{category.label}</p>
                    <p className="font-semibold text-white">{count}</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7dd3c7] to-[#f1c36d]"
                      style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
