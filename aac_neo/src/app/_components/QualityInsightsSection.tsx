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
    <div className="d-flex align-items-start mb-4">
        <div className={`feature-icon ${bgColor} ${textColor} rounded-circle p-3 me-3 d-flex align-items-center justify-content-center`} aria-hidden="true">
            <i className={`bi ${icon}`}></i>
        </div>
        <div>
            <h3 className="h5 fw-bold mb-2">{title}</h3>
            <p className="text-muted mb-0">{description}</p>
        </div>
    </div>
);

const QualityInsightsSection = () => {
    const features = [
        {
            icon: "bi-clipboard-data",
            title: "Real-time Quality Monitoring",
            description: "Track production quality metrics as they happen with custom alerts and notifications for immediate action.",
            bgColor: "bg-success-subtle",
            textColor: "text-success"
        },
        {
            icon: "bi-graph-down",
            title: "Rejection Analysis",
            description: "Identify patterns in rejection rates to pinpoint areas for improvement and reduce waste.",
            bgColor: "bg-primary-subtle",
            textColor: "text-primary"
        },
        {
            icon: "bi-grid-3x3",
            title: "Mould Performance Tracking",
            description: "Compare efficiency across different moulds to maximize throughput and quality.",
            bgColor: "bg-warning-subtle",
            textColor: "text-warning"
        },
        {
            icon: "bi-diagram-3",
            title: "Segregation Analytics",
            description: "Detailed analysis to ensure consistent product density and compliance with quality standards.",
            bgColor: "bg-danger-subtle",
            textColor: "text-danger"
        }
    ];

    return (
        <section className="py-5 quality-insights-section">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6 order-lg-2">
                        <div className="position-relative">
                            <div className="bg-light p-4 rounded-4 shadow-sm feature-card-img">
                                <Image
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&h=350&auto=format&fit=crop"
                                    alt="Analytics Dashboard showing real-time quality metrics"
                                    width={500}
                                    height={350}
                                    className="img-fluid rounded-3"
                                    priority
                                />
                            </div>
                            <div className="position-absolute top-0 end-0 translate-middle p-3 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                <i className="bi bi-bar-chart-line fs-2" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 order-lg-1">
                        <div className="mb-4">
                            <span className="badge bg-primary-subtle text-primary mb-2 rounded-pill px-3 py-2 fw-medium">Real-time Monitoring</span>
                            <h2 className="display-6 fw-bold text-dark mb-4">Quality Insights at Your Fingertips</h2>
                            <p className="lead text-secondary mb-4">Get comprehensive visibility into your AAC production with real-time metrics and intelligent analytics that help you identify trends and optimize operations.</p>
                        </div>

                        <div className="features-list">
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

                            <div className="mt-5 d-flex flex-wrap gap-3">
                                <Link href="/features" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-medium">
                                    Learn More
                                </Link>
                                <Link href="/dashboard" className="btn btn-primary rounded-pill px-4 py-2 fw-medium">
                                    Access Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QualityInsightsSection;