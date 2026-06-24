export function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex flex-col items-center px-6 py-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{title}</span>
      <span className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1.5 tracking-tight">{value}</span>
    </div>
  );
}
