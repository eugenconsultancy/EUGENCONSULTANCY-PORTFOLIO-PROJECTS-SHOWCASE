"use client";

import Image from "next/image";
import Link from "next/link";

type ProjectCard = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    techStack: string;
    viewCount: number;
    readingTime: number;
    images: { id: number; filename: string; alt: string | null; isMain: boolean }[];
};

interface LatestProjectsGridProps {
    projects: ProjectCard[];
}

export function LatestProjectsGrid({ projects }: LatestProjectsGridProps) {
    if (!projects.length) return null;

    return (
        <section className="py-28 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                {/* Section Header */}
                <div className="mb-14">
                    <p className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase mb-4">
                        <span className="w-6 h-px bg-blue-500" />
                        Recent Work
                        <span className="w-6 h-px bg-blue-500" />
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                        Latest Published Case Studies
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl leading-relaxed">
                        Explore the latest software solutions, architectures, and production systems we've delivered.
                    </p>
                </div>

                {/* 2×2 Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project) => {
                        const mainImage = project.images.find((img) => img.isMain) ?? project.images[0];
                        const techs = project.techStack.split(",").map((t) => t.trim());

                        return (
                            <Link
                                key={project.id}
                                href={`/projects/${project.slug}`}
                                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-500 flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                                    {mainImage ? (
                                        <Image
                                            src={mainImage.filename}
                                            alt={mainImage.alt ?? project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-100 dark:from-gray-800 dark:to-gray-700">
                                            <span className="text-7xl opacity-20">📦</span>
                                        </div>
                                    )}

                                    {/* Gradient Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Category Badge - Top Left */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold shadow-lg">
                                            {techs[0] || "Project"}
                                        </span>
                                    </div>

                                    {/* View Button - Center on Hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <span className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl font-bold text-sm shadow-2xl hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200">
                                            Explore Case Study →
                                        </span>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="p-6 lg:p-8 flex flex-col flex-1">
                                    {/* Title */}
                                    <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3">
                                        {project.title}
                                    </h3>

                                    {/* Summary */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2 flex-1">
                                        {project.summary}
                                    </p>

                                    {/* Tech Stack Pills */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {techs.slice(0, 4).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 transition-colors duration-200"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {techs.length > 4 && (
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg text-xs font-semibold">
                                                +{techs.length - 4}
                                            </span>
                                        )}
                                    </div>

                                    {/* Meta Information */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {project.readingTime} min read
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {project.viewCount.toLocaleString()} views
                                            </span>
                                        </div>
                                        <span className="text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                                            Read More
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All CTA */}
                <div className="mt-12 text-center">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
                    >
                        View All Projects
                        <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}