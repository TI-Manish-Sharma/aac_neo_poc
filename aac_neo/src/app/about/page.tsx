import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lightbulb, Zap, ShieldCheck, Users, Clock, Target, Lock } from 'lucide-react';

export const metadata = {
    title: 'About Us',
    description: 'Learn more about Technizer Edge and our mission to transform AAC production insights.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12 px-4 bg-white">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Effortless Insights - Powered by AI
                </h1>
                <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-600">
                    No spreadsheets, no guesswork. Instantly understand your AAC production metrics in plain English.
                </p>
                <Link href="/contact" className="inline-block px-8 py-3 bg-cyan-400 text-white font-semibold rounded-lg shadow hover:bg-cyan-500 transition">
                    Register for Free Trial
                </Link>
            </section>

            {/* Problem & Solution */}
            <section className="py-8 px-4 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10">From Confusion to Clarity</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">The Challenge</h3>
                        <p className="text-gray-600">
                            Endless spreadsheets of production data leave you overwhelmed and unsure what actions to take. Tracking rejection rates, mould performance, and quality metrics becomes a full-time job.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Our Solution</h3>
                        <p className="text-gray-600">
                            Behind the scenes, advanced analytics read your data and speak your language—delivering crystal-clear trends and &quot;next step&quot; suggestions in seconds through intuitive dashboards.
                        </p>
                    </div>
                </div>
                {/* <div className="mt-10 flex justify-center">
                    <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&auto=format&fit=crop"
                        alt="Dashboard preview"
                        width={600}
                        height={300}
                        className="rounded-xl shadow-lg"
                    />
                </div> */}
            </section>

            {/* Mission & Vision */}
            <section className="py-8 px-4 bg-white">
                <div className="max-w-5xl mx-auto space-y-10">
                    <h2 className="text-3xl font-bold text-center mb-10">Our Mission & Vision</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-cyan-50 p-6 rounded-lg border-l-4 border-cyan-400">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Mission</h3>
                            <p className="text-gray-600">
                                To give everyone—from plant operators to management teams—the power of instant, AI-created insights for better AAC production quality and efficiency.
                            </p>
                        </div>
                        <div className="bg-cyan-50 p-6 rounded-lg border-l-4 border-cyan-400">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Vision</h3>
                            <p className="text-gray-600">
                                A future where production data no longer intimidates, but inspires better manufacturing decisions everywhere, leading to enhanced quality and reduced waste.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Company */}
            <section className="py-8 px-4 max-w-5xl mx-auto space-y-6">
                <div className="text-center mb-10">
                    <Image
                        src="/technizer-edge-logo.png"
                        alt="AAC Neo Logo"
                        width={500}
                        height={200}
                        className="mx-auto"
                    />
                </div>
                <h2 className="text-3xl font-bold text-center mb-6">About Technizer Edge Pvt Ltd</h2>
                <div className="bg-white p-8 rounded-lg shadow-sm space-y-4">
                    <p className="text-gray-600">
                        Technizer Edge Pvt Ltd, headquartered in Pune, India, is a sister concern of Technizer India, dedicated to
                        innovative product development and workforce solutions.
                    </p>
                    <p className="text-gray-600">
                        Our flagship product include an AI-powered AAC Plant Process Analytics dashboard, empowering manufacturers 
                        with intelligent automation and real-time insights.
                    </p>
                    <p className="text-gray-600">
                        We combine deep industry expertise with cutting-edge AI technologies to deliver scalable,
                        customizable solutions that drive efficiency and growth.
                    </p>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-8 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: 'Integrity', icon: ShieldCheck, desc: "We tell you exactly what's in the numbers—no hidden surprises." },
                            { title: 'Innovation', icon: Zap, desc: 'We leverage the latest AI breakthroughs so you stay ahead.' },
                            { title: 'Collaboration', icon: Users, desc: 'We partner with you to turn insights into impact.' },
                        ].map((v) => (
                            <div
                                key={v.title}
                                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow transition-transform hover:translate-y-[-5px]"
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="bg-cyan-100 p-3 rounded-full">
                                        <v.icon className="w-8 h-8 text-cyan-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-center mb-4">{v.title}</h3>
                                <p className="text-gray-600 text-center">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What We Offer */}
            <section className="py-8 px-4 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-10">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { title: 'Clarity', icon: Lightbulb, desc: 'Summaries & trend explanations in everyday language—powering better decisions.' },
                        { title: 'Speed', icon: Clock, desc: 'Live dashboards and instant alerts—see changes as they happen.' },
                        { title: 'Actionability', icon: Target, desc: '"Here\'s what to do next" recommendations, powered by advanced analytics.' },
                        { title: 'Trust', icon: Lock, desc: 'Enterprise-grade security keeps your production data safe at every step.' },
                    ].map((v) => (
                        <div key={v.title} className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-start space-x-4">
                                <div className="bg-cyan-100 p-2 rounded-full">
                                    <v.icon className="w-6 h-6 text-cyan-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
                                    <p className="text-gray-600">{v.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-cyan-400 to-blue-900 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Production Insights?</h2>
                    <p className="text-lg mb-8">Explore how simple insights can fuel smarter decisions today.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/contact" className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg shadow transition">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}