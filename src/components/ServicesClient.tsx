"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Star, Clock, ChevronDown, ChevronUp, Send } from "lucide-react";

type Service = {
    id: number;
    title: string;
    slug: string;
    category: string;
    summary: string;
    description: string;
    icon: string;
    features: string;
    tools: string;
    benefits: string;
    process: string;
    pricing: string | null;
    status: string;
    displayOrder: number;
};

interface ServicesClientProps {
    services: Service[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
};

export function ServicesClient({ services }: ServicesClientProps) {
    const [expandedService, setExpandedService] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = ["All", ...new Set(services.map((s) => s.category))];
    const filteredServices = selectedCategory === "All"
        ? services
        : services.filter((s) => s.category === selectedCategory);

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 sm:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase mb-4">
                            <span className="w-6 h-px bg-blue-500" />
                            Expert Services
                            <span className="w-6 h-px bg-blue-500" />
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
                            Professional Services for<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500">
                                Data-Driven Growth
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            From statistical analysis and SEO optimization to security testing and content strategy —
                            I provide expert consulting services to help your business thrive in the digital age.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-gray-50 dark:bg-gray-950/60 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${selectedCategory === category
                                        ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30"
                                        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {filteredServices.map((service) => {
                            const features = JSON.parse(service.features) as string[];
                            const tools = JSON.parse(service.tools) as string[];
                            const benefits = JSON.parse(service.benefits) as string[];
                            const process = JSON.parse(service.process) as { step: string; description: string }[];
                            const pricing = service.pricing ? JSON.parse(service.pricing) : null;
                            const isExpanded = expandedService === service.id;

                            return (
                                <motion.div
                                    key={service.id}
                                    variants={itemVariants}
                                    className={`group relative rounded-3xl border transition-all duration-500 ${isExpanded
                                            ? "border-blue-300 dark:border-blue-700 shadow-2xl"
                                            : "border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800"
                                        } bg-white dark:bg-gray-900 overflow-hidden`}
                                >
                                    {/* Gradient Top Bar */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="p-8">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center text-2xl shadow-lg">
                                                    {service.icon}
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                                        {service.category}
                                                    </span>
                                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                                                        {service.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                            {service.summary}
                                        </p>

                                        {/* Quick Highlights */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            {features.slice(0, 4).map((feature, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Expand/Collapse Button */}
                                        <button
                                            onClick={() => setExpandedService(isExpanded ? null : service.id)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                                        >
                                            {isExpanded ? (
                                                <>
                                                    <ChevronUp className="w-4 h-4" />
                                                    Show Less
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-4 h-4" />
                                                    View Full Details
                                                </>
                                            )}
                                        </button>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-6 space-y-8 border-t border-gray-100 dark:border-gray-800 pt-6"
                                            >
                                                {/* Full Description */}
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">Overview</h4>
                                                    <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                                        {service.description}
                                                    </div>
                                                </div>

                                                {/* All Features */}
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">Features</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {features.map((feature, i) => (
                                                            <div key={i} className="flex items-start gap-2">
                                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Tools */}
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">Tools & Technologies</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {tools.map((tool, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold"
                                                            >
                                                                {tool}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Benefits */}
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">Benefits</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {benefits.map((benefit, i) => (
                                                            <div key={i} className="flex items-start gap-2">
                                                                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Process */}
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">Our Process</h4>
                                                    <div className="space-y-4">
                                                        {process.map((step, i) => (
                                                            <div key={i} className="flex gap-4">
                                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                                                                    {i + 1}
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-bold text-gray-900 dark:text-white text-sm">{step.step}</h5>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Pricing */}
                                                {pricing && (
                                                    <div>
                                                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">Pricing</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                            {Object.values(pricing).map((plan: any, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                                                                >
                                                                    <h5 className="font-black text-gray-900 dark:text-white mb-1">{plan.name}</h5>
                                                                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-3">{plan.price}</p>
                                                                    <ul className="space-y-1.5">
                                                                        {plan.features.map((feature: string, j: number) => (
                                                                            <li key={j} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                                                <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                                                                                {feature}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* CTA */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Typical turnaround: 2-7 business days</span>
                                                    </div>
                                                    <Link
                                                        href={`/contact?service=${service.slug}`}
                                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/30 transition-all duration-200"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                        Request This Service
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-950/60">
                <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                        Need a Custom Solution?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Don't see exactly what you need? I offer custom consulting packages tailored to your specific requirements.
                        Let's discuss your project and create a solution that fits.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg hover:from-blue-700 hover:to-violet-700 shadow-xl shadow-blue-500/30 transition-all duration-200 hover:-translate-y-1"
                    >
                        Get a Custom Quote
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}