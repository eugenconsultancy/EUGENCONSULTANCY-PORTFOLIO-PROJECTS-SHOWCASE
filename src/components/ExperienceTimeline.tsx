"use client";

import { FadeInSection } from "./FadeInSection";

type Exp = {
  id: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
};

export function ExperienceTimeline({ experiences }: { experiences: Exp[] }) {
  return (
    <div className="relative pl-10 ml-4 before:absolute before:left-2 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500 before:to-purple-500 before:rounded-full">
      {experiences.map((exp) => (
        <FadeInSection key={exp.id}>
          <div className="mb-10 relative">
            {/* Timeline node */}
            <div
              className="
                absolute -left-[2.15rem] top-1.5 h-6 w-6 rounded-full
                bg-gradient-to-br from-blue-500 to-indigo-600
                ring-4 ring-white dark:ring-gray-950
                shadow-lg shadow-blue-500/30
              "
            />
            {/* Card */}
            <div
              className="
                bg-white dark:bg-gray-900
                rounded-2xl p-6
                shadow-lg border border-gray-100 dark:border-gray-800
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300
              "
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 self-start sm:self-auto">
                  {exp.startDate} – {exp.endDate || "Present"}
                </span>
              </div>
              {exp.description && (
                <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{exp.description}</p>
              )}
            </div>
          </div>
        </FadeInSection>
      ))}
    </div>
  );
}
