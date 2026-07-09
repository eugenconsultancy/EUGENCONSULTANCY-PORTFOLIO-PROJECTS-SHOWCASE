import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Star, Clock, ArrowRight } from "lucide-react";

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const service = await db.service.findUnique({
        where: { slug: params.slug, status: "PUBLISHED" },
    });

    if (!service) {
        return { title: "Service Not Found" };
    }

    return {
        title: `${service.title} — Eugen Consultancy`,
        description: service.summary,
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const service = await db.service.findUnique({
        where: { slug: params.slug, status: "PUBLISHED" },
        include: {
            testimonials: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!service) {
        notFound();
    }

    const features = JSON.parse(service.features) as string[];
    const tools = JSON.parse(service.tools) as string[];
    const benefits = JSON.parse(service.benefits) as string[];
    const process = JSON.parse(service.process) as { step: string; description: string }[];
    const pricing = service.pricing ? JSON.parse(service.pricing) : null;

    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="relative py-20 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-gray-900 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Services
                    </Link>

                    <div className="flex items-start gap-6 mb-6">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-4xl shadow-xl flex-shrink-0">
                            {service.icon}
                        </div>
                        <div>
                            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
                                {service.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-3 mb-4">
                                {service.title}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                                {service.summary}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="prose prose-lg dark:prose-invert max-w-4xl">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Overview</h2>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                            {service.description}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gray-50 dark:bg-gray-950/60">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Tools & Technologies</h2>
                    <div className="flex flex-wrap gap-3">
                        {tools.map((tool, i) => (
                            <span
                                key={i}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-semibold"
                            >
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 bg-gray-50 dark:bg-gray-950/60">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Our Process</h2>
                    <div className="space-y-6">
                        {process.map((step, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {i + 1}
                                </div>
                                <div className="pt-2">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{step.step}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            {pricing && (
                <section className="py-16 bg-gray-50 dark:bg-gray-950/60">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 text-center">Pricing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {Object.values(pricing).map((plan: any, i) => (
                                <div
                                    key={i}
                                    className={`rounded-3xl p-8 border-2 transition-all ${i === 1
                                            ? "border-blue-500 bg-white dark:bg-gray-900 shadow-2xl scale-105"
                                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                                        }`}
                                >
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                    <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-6">{plan.price}</p>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature: string, j: number) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={`/contact?service=${service.slug}`}
                                        className={`block text-center py-3 rounded-xl font-bold text-sm transition-all ${i === 1
                                                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:-translate-y-1"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Contact us today to discuss your project needs and get a personalized quote.
                    </p>
                    <Link
                        href={`/contact?service=${service.slug}`}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg hover:from-blue-700 hover:to-violet-700 shadow-xl hover:-translate-y-1 transition-all"
                    >
                        Request This Service
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}