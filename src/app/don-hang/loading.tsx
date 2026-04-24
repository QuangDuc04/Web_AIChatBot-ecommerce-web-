export default function OrdersLoading() {
  return (
    <div className="container animate-pulse py-8">
      <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-[8px]" />
        ))}
      </div>
    </div>
  );
}
