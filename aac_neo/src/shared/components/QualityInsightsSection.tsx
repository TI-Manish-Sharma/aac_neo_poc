import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    bgColor: string;
    textColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, bgColor, textColor }) => (
    <div className="flex items-start mb-4">
        <div className={`${bgColor} ${textColor} rounded-full p-3 mr-3 flex items-center justify-center`} aria-hidden="true">
            <i className={`bi ${icon}`}></i>
        </div>
        <div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-gray-500 mb-0">{description}</p>
        </div>
    </div>
);

const QualityInsightsSection = () => {
    const features = [
        {
            icon: "bi-clipboard-data",
            title: "Real-time Quality Monitoring",
            description: "Track production quality metrics as they happen with custom alerts and notifications for immediate action.",
            bgColor: "bg-green-100",
            textColor: "text-green-600"
        },
        {
            icon: "bi-graph-down",
            title: "Rejection Analysis",
            description: "Identify patterns in rejection rates to pinpoint areas for improvement and reduce waste.",
            bgColor: "bg-blue-100",
            textColor: "text-blue-600"
        },
        {
            icon: "bi-grid-3x3",
            title: "Mould Performance Tracking",
            description: "Compare efficiency across different moulds to maximize throughput and quality.",
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-600"
        },
        {
            icon: "bi-diagram-3",
            title: "Segregation Analytics",
            description: "Detailed analysis to ensure consistent product density and compliance with quality standards.",
            bgColor: "bg-red-100",
            textColor: "text-red-600"
        }
    ];

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
                        <div className="mb-8">
                            <span className="inline-block bg-cyan-100 text-cyan-700 px-3 py-2 rounded-full font-medium mb-2">Real-time Monitoring</span>
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Quality Insights at Your Fingertips</h2>
                            <p className="text-xl text-gray-600 mb-4">Get comprehensive visibility into your AAC production with real-time metrics and intelligent analytics that help you identify trends and optimize operations.</p>
                        </div>

                        <div>
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                    bgColor={feature.bgColor}
                                    textColor={feature.textColor}
                                />
                            ))}

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href="/features" className="border border-cyan-400 text-cyan-400 hover:bg-cyan-50 rounded-full px-6 py-2 font-medium transition">
                                    Learn More
                                </Link>
                                <Link href="/dashboard" className="bg-cyan-400 text-white hover:bg-cyan-500 rounded-full px-6 py-2 font-medium transition">
                                    Access Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="relative">
                            <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
                                <Image
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&h=350&auto=format&fit=crop"
                                    alt="Analytics Dashboard showing real-time quality metrics"
                                    width={500}
                                    height={350}
                                    className="w-full rounded-lg"
                                    priority
                                />
                            </div>
                            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 p-3 rounded-full bg-cyan-400 text-white flex items-center justify-center" style={{ width: '60px', height: '60px' }}>
                                <i className="bi bi-bar-chart-line text-2xl" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QualityInsightsSection;