import { Mail, ArrowRight, Code2 } from "lucide-react";

// Inline SVG components for brand icons (lucide-react does not export these)
function GithubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const techStack = ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "AWS"];

const navLinks = {
  Pages: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "Our Services", href: "/projects" },   // now points to projects
  ],
};

const socials = [
  { icon: <GithubIcon />, href: "https://github.com/eugenconsultancy", label: "GitHub" },
  { icon: <LinkedinIcon />, href: "https://linkedin.com/in/eugen-gachie", label: "LinkedIn" },
  { icon: <TwitterIcon />, href: "https://twitter.com/eugenconsultancy", label: "Twitter / X" },
  { icon: <Mail size={16} />, href: "mailto:eugenbku@gmail.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      {/* Subtle background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -z-10"
      />

      {/* ── Availability CTA banner – made compact ── */}
      <div className="border-b border-gray-100 dark:border-gray-800/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">
              Currently Available
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Available for Consultancy & Freelance Projects
            </h2>
          </div>
          <a
            href="/contact"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Schedule Consultation
            <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* ── Main footer body – compact ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30 text-sm tracking-tight">
                EC
              </div>
              <span className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">
                EugenConsultancy
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
              Full‑Stack Developer · Data Analyst · Embedded Systems. Turning complex requirements into revenue‑generating tools.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-gray-50 dark:bg-gray-800/60 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(navLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                {heading}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column – updated with real email & phone */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              Contact
            </p>
            <ul className="space-y-2.5">
              <li>
                <p className="text-xs text-gray-400 dark:text-gray-600 mb-0.5">Email</p>
                <a
                  href="mailto:eugenbku@gmail.com"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  eugenbku@gmail.com
                </a>
              </li>
              <li>
                <p className="text-xs text-gray-400 dark:text-gray-600 mb-0.5">Phone</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">+254 108 038 898</p>
              </li>
              <li>
                <p className="text-xs text-gray-400 dark:text-gray-600 mb-0.5">Location</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Nairobi, Kenya</p>
              </li>
              <li className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Available for hire
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Tech stack + copyright strip – slimmed down ── */}
      <div className="border-t border-gray-100 dark:border-gray-800/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tech badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Code2 size={13} className="text-gray-400 dark:text-gray-600 flex-shrink-0" />
            <span className="text-xs text-gray-400 dark:text-gray-600 mr-1">Built with</span>
            {techStack.map((tech) => (
              <span
                key={tech}
                className="inline-block px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium border border-gray-200 dark:border-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400 dark:text-gray-600 whitespace-nowrap">
            &copy; {new Date().getFullYear()} EugenConsultancy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}