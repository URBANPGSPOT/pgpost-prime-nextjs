import { getPageBySlug } from "@/lib/api";
import parse from "html-react-parser";

export default async function HomePage() {
  const page = await getPageBySlug("home");

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 font-heading">
          Welcome to <span className="gradient-text">PGSPOT Headless CMS</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your headless Next.js frontend is connected to WordPress, but we couldn't find a page with the slug{" "}
          <code className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 font-mono text-sm">home</code>.
        </p>
        <div className="premium-card p-8 rounded-2xl max-w-lg mx-auto text-left border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 font-heading">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-slate-400">
            <li>
              Open your WordPress admin dashboard (e.g., at{" "}
              <code className="px-1 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                http://localhost:8081/wp-admin/
              </code>
              ).
            </li>
            <li>
              Create a new Page with the title "Home" and slug{" "}
              <code className="px-1 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">home</code>.
            </li>
            <li>Publish the page, and then refresh this frontend.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {page.content ? (
        parse(page.content)
      ) : (
        <p className="text-slate-500 italic text-center py-20">No content published yet.</p>
      )}
    </div>
  );

}
