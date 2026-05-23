export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-slate-600">
          <span className="text-blue-500">vans</span>rzb · {new Date().getFullYear()}
        </p>
        <p className="font-mono text-xs text-slate-700">
          Built with React · TypeScript · Tailwind · Framer Motion
        </p>
      </div>
    </footer>
  );
}
