import { ContactForm } from "@/components/ContactForm";
import { generateMathChallenge } from "@/lib/spam";

export default function ContactPage() {
    const { num1, num2, token } = generateMathChallenge();

    return (
        <main className="max-w-6xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8">Contact Me</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                    <ContactForm num1={num1} num2={num2} token={token} />
                </div>

                {/* Map & Info */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">📍 Location</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Nairobi, Kenya
                        </p>
                    </div>

                    {/* OpenStreetMap iframe (free, no API key) */}
                    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <iframe
                            title="Location Map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=36.78,-1.32,36.85,-1.28&amp;layer=mapnik&amp;marker=-1.2921,36.8219"
                            style={{ border: 0 }}
                        />
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>📞 +254 108 038 898</p>
                        <p>✉ eugenbku@gmail.com</p>
                    </div>
                </div>
            </div>
        </main>
    );
}