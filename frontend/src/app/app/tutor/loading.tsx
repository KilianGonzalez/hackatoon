export default function TutorLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gray-200 rounded-3xl h-48" />
      
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border p-6 h-32">
            <div className="h-10 w-10 bg-gray-200 rounded-xl mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6 h-80">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border p-6 h-80">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
