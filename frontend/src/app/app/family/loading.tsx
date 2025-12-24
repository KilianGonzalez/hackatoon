export default function FamilyLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gray-200 rounded-3xl h-44" />
      
      {/* Content skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border p-6 h-64">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border p-6 h-48">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
            <div className="h-24 bg-gray-100 rounded-xl" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 h-56">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-gray-200 rounded-2xl h-40" />
        </div>
      </div>
    </div>
  )
}
