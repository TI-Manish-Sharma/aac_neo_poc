import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart3, TrendingUp, Gauge, AlertTriangle, Truck, LifeBuoy } from 'lucide-react';
import FeatureCard from './FeatureCard';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-gray-100 to-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                            <span className="text-cyan-500">Comprehensive</span> Quality Monitoring
                        </h1>
                        <p className="text-xl text-gray-600">
                            Discover how AAC Neo&apos;s powerful features help optimize your autoclaved aerated concrete production with real-time data, advanced analytics, and actionable insights.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Features Section */}
            <section className="bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto mb-6 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Core Features</h2>
                        <p className="text-gray-600">
                            Our platform offers a comprehensive set of tools designed to transform your AAC production quality monitoring.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <FeatureCard
                            icon={<BarChart3 className="text-cyan-700" size={24} />}
                            title="Production Process Monitoring"
                            description="Track critical cutting process metrics in real-time with comprehensive dashboards displaying rejection rates, types, and quality trends to identify issues before they impact production."
                            bgColor="bg-cyan-100"
                        />
                        <FeatureCard
                            icon={<TrendingUp className="text-blue-700" size={24} />}
                            title="Rejection Trend Analysis"
                            description="Analyze rejection patterns over time with advanced filtering options by date and type to identify root causes and implement targeted improvements."
                            bgColor="bg-blue-100"
                        />

                        <FeatureCard
                            icon={<Truck className="text-blue-700" size={24} />}
                            title="Order Dispatch Monitoring"
                            description="Monitor real-time dispatch status with comprehensive tracking of AAC blocks."
                            bgColor="bg-blue-100"
                        />

                        <FeatureCard
                            icon={<LifeBuoy className="text-purple-700" size={24} />}
                            title="Batch Lifecycle"
                            description="Track production batches from raw materials to finished product with comprehensive visibility into curing times, quality tests, inventory status, and complete batch history."
                            bgColor="bg-purple-100"
                        />
                        <FeatureCard
                            icon={<Gauge className="text-purple-700" size={24} />}
                            title="Real-time KPI Dashboard"
                            description="View critical performance indicators at a glance with customizable dashboards displaying the metrics that matter most to your operation."
                            bgColor="bg-purple-100"
                        />
                        <FeatureCard
                            icon={<AlertTriangle className="text-red-700" size={24} />}
                            title="Intelligent Alerts"
                            description="Receive proactive notifications when quality metrics exceed thresholds, allowing for immediate intervention and corrective action."
                            bgColor="bg-red-100"
                        />
                    </div>
                </div>
            </section>

            {/* Feature Benefits Section */}
            <section className="py-6 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto mb-6 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose AAC Neo?</h2>
                        <p className="text-gray-600">
                            Our platform delivers tangible benefits that directly impact your production efficiency and product quality.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Reduce Rejection Rates</h3>
                            <p className="text-gray-600 mb-6">
                                Achieve a substantial reduction in rejection rates with enhanced monitoring and proactive maintenance. By identifying defect patterns early, you can implement targeted improvements that significantly increase your production yield and overall efficiency.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Identify top defect causes automatically",
                                    "Track improvements over time with historical data",
                                    "Get recommendations for process adjustments",
                                    "Forecast quality metrics based on process parameters"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                                            <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex justify-center items-center w-full">
                            <div className="relative">
                                <div className="bg-white p-3 rounded-lg shadow-md">
                                    <Image
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&h=350&auto=format&fit=crop"
                                        alt="Analytics Dashboard showing quality improvements"
                                        width={500}
                                        height={350}
                                        className="rounded-lg"
                                    />
                                </div>
                                <div className="absolute -top-5 -right-5 bg-cyan-500 text-white p-3 rounded-full shadow-lg">
                                    <span className="font-bold">-42%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="flex justify-center items-center w-full">
                            <div className="order-2 md:order-1 relative">
                                <div className="bg-white p-3 rounded-lg shadow-md">
                                    <Image
                                        src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=500&h=350&auto=format&fit=crop"
                                        alt="Factory workers reviewing quality data"
                                        width={500}
                                        height={350}
                                        className="rounded-lg"
                                    />
                                </div>
                                <div className="absolute -bottom-5 -left-5 bg-blue-500 text-white p-3 rounded-full shadow-lg">
                                    <span className="font-bold">+38%</span>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Improve Operational Efficiency</h3>
                            <p className="text-gray-600 mb-6">
                                Transform your quality management approach from reactive to proactive. Our analytics help you optimize maintenance schedules, reduce downtime, and make data-driven decisions that boost productivity substantially.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Implement preventive maintenance based on data trends",
                                    "Optimize resource allocation with predictive analytics",
                                    "Reduce quality-related production stoppages",
                                    "Streamline quality inspection processes"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                            <svg className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto mb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Technical Specifications</h2>
                        <p className="text-gray-600">
                            Built with modern technologies for reliability, performance, and scalability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Analytics with LLM</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>LLM-driven predictive trend analysis</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>Contextual insights from complex datasets</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>Automated, natural-language report generation</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>Interactive, conversational data exploration</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>Actionable recommendations tailored to your goals</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Visualization</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>Recharts for interactive graphs</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>Real-time data updates</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>Responsive design for all devices</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>Custom color schemes for data clarity</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Integration</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>RESTful API connectivity</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>CSV/Excel data export</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>Email alert notifications</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                                    <span>ERP system compatibility</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-cyan-400 to-blue-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Quality Management?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Start monitoring your AAC production quality with real-time insights and actionable analytics.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/dashboard/analytics"
                            className="bg-white text-cyan-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300"
                        >
                            Explore Analytics Dashboard
                        </Link>
                        <Link
                            href="/dashboard/operations"
                            className="bg-white text-cyan-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300"
                        >
                            Explore Realtime Dashboard
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition duration-300"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}