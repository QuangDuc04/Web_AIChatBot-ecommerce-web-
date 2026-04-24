export default function HomeLoading() {
  return (
    <div className="container animate-pulse">
      {/* Banner skeleton */}
      <div className="h-[300px] bg-gray-200 rounded-[12px] my-4" />
      {/* Products grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[280px] bg-gray-200 rounded-[16px]" />
        ))}
      </div>
    </div>
  );
}
