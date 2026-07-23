import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="premium-card p-12 rounded-3xl max-w-md w-full border border-slate-900">
        <span className="text-sm font-extrabold tracking-wider text-teal-400 uppercase font-heading">
          404 Error
        </span>
        <h1 className="text-4xl font-extrabold text-white mt-4 mb-6 font-heading">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily
          unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-slate-950 bg-teal-500 hover:bg-teal-400 transition-all font-heading"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
