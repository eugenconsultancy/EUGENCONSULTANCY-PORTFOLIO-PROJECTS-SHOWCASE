export function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 dark:border-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              P
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Portfolio</span>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
            <a href="/projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Projects</a>
            <a href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</a>
            <a href="/rss.xml" className="hover:text-blue-600 dark:hover:text-blue-400 transition">RSS</a>
          </div>

          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
