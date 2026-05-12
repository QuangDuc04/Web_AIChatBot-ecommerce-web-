export default function ProductLoading() {
  return (
    <div className="container animate-pulse py-6">
      <div className="h-6 bg-gray-200 rounded w-64 mb-4" /> {/* breadcrumb */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-[400px] bg-gray-200 rounded-[12px]" /> {/* image */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" /> {/* name */}
          <div className="h-6 bg-gray-200 rounded w-1/3" /> {/* price */}
          <div className="h-24 bg-gray-200 rounded" /> {/* description */}
          <div className="h-12 bg-gray-200 rounded" /> {/* add to cart */}
        </div>
      </div>
    </div>
  );
}
