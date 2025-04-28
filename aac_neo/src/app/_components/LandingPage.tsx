'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import HeroSection from './HeroSection';
import QualityInsightsSection from './QualityInsightsSection';

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <HeroSection />

            {/* Main Features Section */}
           <QualityInsightsSection />

            {/* Feature Cards Section */}
            {/* <section className="py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="badge bg-primary-subtle text-primary mb-2 rounded-pill px-3 py-2">Key Benefits</span>
                        <h2 className="display-6 fw-bold mb-3">Optimize Your AAC Production</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
                            Our comprehensive analytics platform provides you with the insights you need to improve quality, 
                            reduce waste, and increase profitability.
                        </p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm feature-card">
                                <div className="card-body p-4">
                                    <div className="feature-icon-wrapper mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary-subtle rounded-circle p-3">
                                            <i className="bi bi-graph-up text-primary fs-4"></i>
                                        </div>
                                    </div>
                                    <h3 className="h4 fw-bold mb-3">Rejection Trend Analysis</h3>
                                    <p className="text-muted mb-4">Identify patterns in rejection rates over time with advanced analytics that help you spot opportunities for improvement.</p>
                                    <ul className="list-unstyled mb-0">
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Historical trend visualization</span>
                                        </li>
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Rejection cause categorization</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Predictive analytics</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm feature-card">
                                <div className="card-body p-4">
                                    <div className="feature-icon-wrapper mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle rounded-circle p-3">
                                            <i className="bi bi-grid-3x3-gap text-success fs-4"></i>
                                        </div>
                                    </div>
                                    <h3 className="h4 fw-bold mb-3">Mould Performance Optimization</h3>
                                    <p className="text-muted mb-4">Compare and optimize performance across different moulds to maximize production efficiency and product quality.</p>
                                    <ul className="list-unstyled mb-0">
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Comparative mould analysis</span>
                                        </li>
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Lifespan tracking</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Maintenance scheduling</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm feature-card">
                                <div className="card-body p-4">
                                    <div className="feature-icon-wrapper mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-danger-subtle rounded-circle p-3">
                                            <i className="bi bi-layers text-danger fs-4"></i>
                                        </div>
                                    </div>
                                    <h3 className="h4 fw-bold mb-3">Segregation Intelligence</h3>
                                    <p className="text-muted mb-4">Detailed segregation analysis ensures consistent product density and compliance with quality standards.</p>
                                    <ul className="list-unstyled mb-0">
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Density distribution mapping</span>
                                        </li>
                                        <li className="d-flex align-items-center mb-2">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Consistency tracking</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Quality standard compliance</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Testimonials Section */}
            {/* <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="badge bg-primary-subtle text-primary mb-2 rounded-pill px-3 py-2">Testimonials</span>
                        <h2 className="display-6 fw-bold mb-3">What Our Users Say</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
                            See how AAC Neo has helped manufacturers improve their production quality and efficiency
                        </p>
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm testimonial-card">
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                    </div>
                                    <p className="mb-4 fst-italic">"AAC Neo has transformed our quality control process. The real-time analytics have helped us reduce rejection rates by 35% and improve overall product consistency."</p>
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <Image 
                                                src="/api/placeholder/60/60" 
                                                alt="User" 
                                                width={60} 
                                                height={60} 
                                                className="rounded-circle"
                                            />
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-bold">Michael Johnson</h5>
                                            <p className="mb-0 text-muted small">Production Manager, EcoBlock</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm testimonial-card">
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                    </div>
                                    <p className="mb-4 fst-italic">"The mould performance tracking feature has been a game-changer for our maintenance schedule. We've extended mould life by 40% since implementing AAC Neo."</p>
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <Image 
                                                src="/api/placeholder/60/60" 
                                                alt="User" 
                                                width={60} 
                                                height={60} 
                                                className="rounded-circle"
                                            />
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-bold">Sarah Chen</h5>
                                            <p className="mb-0 text-muted small">Technical Director, BuildTech</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 border-0 shadow-sm testimonial-card">
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                        <i className="bi bi-star-fill text-warning"></i>
                                    </div>
                                    <p className="mb-4 fst-italic">"The segregation analysis tools have helped us maintain consistent quality across our entire product range. Our regulatory compliance has never been better."</p>
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <Image 
                                                src="/api/placeholder/60/60" 
                                                alt="User" 
                                                width={60} 
                                                height={60} 
                                                className="rounded-circle"
                                            />
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-bold">David Rodriguez</h5>
                                            <p className="mb-0 text-muted small">Quality Manager, ConcreteSolutions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* CTA Section */}
            {/* <section className="py-5">
                <div className="container">
                    <div className="cta-card bg-primary rounded-4 p-5 text-center text-white position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 w-100 h-100 cta-bg-pattern opacity-10"></div>
                        <div className="position-relative">
                            <Image 
                                src="/aac-neo-icon.png" 
                                alt="AAC Neo Icon" 
                                width={80} 
                                height={80} 
                                className="mb-4"
                            />
                            <h2 className="display-4 fw-bold mb-3">Ready to transform your AAC production?</h2>
                            <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
                                Join hundreds of manufacturers who have optimized their operations with AAC Neo.
                                Get started today and see the difference in your production metrics.
                            </p>
                            <div className="d-flex justify-content-center flex-wrap gap-3">
                                <Link href="/dashboard" className="btn btn-light btn-lg px-5 py-3 fw-bold text-primary rounded-pill">
                                    <i className="bi bi-speedometer2 me-2"></i>
                                    Launch Dashboard
                                </Link>
                                <Link href="/contact" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
                                    <i className="bi bi-headset me-2"></i>
                                    Request Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Footer */}
            {/* <footer className="bg-dark text-white py-5 mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 mb-4 mb-lg-0">
                            <div className="d-flex align-items-center mb-3">
                                <Image 
                                    src="/aac-neo-icon.png" 
                                    alt="AAC Neo Icon" 
                                    width={40} 
                                    height={40} 
                                    className="me-2"
                                />
                                <span className="fw-bold fs-4 text-white">AAC Neo</span>
                            </div>
                            <p className="text-white-50 mb-4">Transforming AAC production with intelligent analytics and real-time monitoring solutions.</p>
                            <div className="d-flex gap-3">
                                <a href="#" className="text-white-50 hover-text-white">
                                    <i className="bi bi-facebook fs-5"></i>
                                </a>
                                <a href="#" className="text-white-50 hover-text-white">
                                    <i className="bi bi-twitter fs-5"></i>
                                </a>
                                <a href="#" className="text-white-50 hover-text-white">
                                    <i className="bi bi-linkedin fs-5"></i>
                                </a>
                                <a href="#" className="text-white-50 hover-text-white">
                                    <i className="bi bi-youtube fs-5"></i>
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
                            <h5 className="fw-bold mb-3">Product</h5>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2"><Link href="/features" className="text-white-50 hover-text-white text-decoration-none">Features</Link></li>
                                <li className="mb-2"><Link href="/pricing" className="text-white-50 hover-text-white text-decoration-none">Pricing</Link></li>
                                <li className="mb-2"><Link href="/dashboard" className="text-white-50 hover-text-white text-decoration-none">Dashboard</Link></li>
                                <li className="mb-2"><Link href="/integrations" className="text-white-50 hover-text-white text-decoration-none">Integrations</Link></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
                            <h5 className="fw-bold mb-3">Resources</h5>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2"><Link href="/blog" className="text-white-50 hover-text-white text-decoration-none">Blog</Link></li>
                                <li className="mb-2"><Link href="/case-studies" className="text-white-50 hover-text-white text-decoration-none">Case Studies</Link></li>
                                <li className="mb-2"><Link href="/webinars" className="text-white-50 hover-text-white text-decoration-none">Webinars</Link></li>
                                <li className="mb-2"><Link href="/documentation" className="text-white-50 hover-text-white text-decoration-none">Documentation</Link></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-4">
                            <h5 className="fw-bold mb-3">Company</h5>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2"><Link href="/about" className="text-white-50 hover-text-white text-decoration-none">About Us</Link></li>
                                <li className="mb-2"><Link href="/contact" className="text-white-50 hover-text-white text-decoration-none">Contact</Link></li>
                                <li className="mb-2"><Link href="/careers" className="text-white-50 hover-text-white text-decoration-none">Careers</Link></li>
                                <li className="mb-2"><Link href="/privacy" className="text-white-50 hover-text-white text-decoration-none">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 mt-4 mt-lg-0">
                            <h5 className="fw-bold mb-3">Support</h5>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2"><Link href="/help" className="text-white-50 hover-text-white text-decoration-none">Help Center</Link></li>
                                <li className="mb-2"><Link href="/faqs" className="text-white-50 hover-text-white text-decoration-none">FAQs</Link></li>
                                <li className="mb-2"><Link href="/training" className="text-white-50 hover-text-white text-decoration-none">Training</Link></li>
                                <li className="mb-2"><Link href="/contact-support" className="text-white-50 hover-text-white text-decoration-none">Contact Support</Link></li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-4 border-secondary" />
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <p className="mb-0">&copy; {new Date().getFullYear()} AAC Neo. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item">
                                    <Link href="/terms" className="text-white-50 hover-text-white text-decoration-none small">Terms of Service</Link>
                                </li>
                                <li className="list-inline-item ms-3">
                                    <Link href="/privacy" className="text-white-50 hover-text-white text-decoration-none small">Privacy Policy</Link>
                                </li>
                                <li className="list-inline-item ms-3">
                                    <Link href="/cookies" className="text-white-50 hover-text-white text-decoration-none small">Cookie Policy</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer> */}


        </div>
    );
};

export default LandingPage;