import Image from "next/image";

type Cert = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  verificationUrl: string | null;
  logo: string | null;
};

export function CertificationBadges({ certifications }: { certifications: Cert[] }) {
  if (certifications.length === 0) {
    return <p className="text-gray-500 text-center">No certifications added yet.</p>;
  }

  return (
    <div>
      {/* Certification stats */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl text-sm font-medium text-blue-700 dark:text-blue-300">
          {certifications.length} Certification{certifications.length !== 1 ? "s" : ""}
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-2xl text-sm font-medium text-indigo-700 dark:text-indigo-300">
          {new Set(certifications.map((c) => c.issuer)).size} Provider{new Set(certifications.map((c) => c.issuer)).size !== 1 ? "s" : ""}
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-2xl text-sm font-medium text-purple-700 dark:text-purple-300">
          Latest: {certifications.sort((a, b) => (b.date < a.date ? -1 : 1))[0]?.date}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center text-center"
          >
            {/* Ribbon */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Verified
            </div>

            {/* Logo */}
            <div className="w-20 h-20 mb-4 relative">
              {cert.logo ? (
                <Image src={cert.logo} alt={cert.title} fill className="object-contain" />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-2xl">
                  🏆
                </div>
              )}
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{cert.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cert.issuer}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{cert.date}</p>

            {cert.verificationUrl && (
              <a
                href={cert.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verify
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
