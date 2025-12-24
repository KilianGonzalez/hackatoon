export default function CompanyLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gray-200 rounded-3xl h-44" />
      
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border p-6 h-28">
            <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6 h-72">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-6 h-72">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
