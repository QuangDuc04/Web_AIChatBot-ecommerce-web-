export default function CategoryLoading() {
  return (
    <div className="container animate-pulse py-6">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4" /> {/* breadcrumb */}
      <div className="h-8 bg-gray-200 rounded w-64 mb-6" /> {/* title */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-[300px] bg-gray-200 rounded-[16px]" />
        ))}
      </div>
    </div>
  );
}
