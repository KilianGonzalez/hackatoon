export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="h-10 bg-gray-200 rounded w-1/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-1/3 mb-8" />
      
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-6 h-28">
            <div className="h-8 w-8 bg-gray-200 rounded-lg mb-3" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-1" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6 h-80">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6 h-80">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
