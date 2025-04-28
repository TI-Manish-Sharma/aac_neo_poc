import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="hero-section py-5 bg-light">
      <div className="container px-4 py-5">
        <div className="row align-items-center g-5">
          {/* Left column - Text content */}
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="mb-4">
              <div className="d-flex align-items-center mb-4">
                <Image 
                  src="/aac-neo-icon.png" 
                  alt="AAC Neo Icon" 
                  width={150} 
                  height={150} 
                  className="me-4" 
                />
                <h1 className="display-5 fw-bold mb-0">
                  <span className="text-primary">AAC Neo</span>
                  <br />
                  <span className="text-dark">Plant Intelligence</span>
                </h1>
              </div>
              <p className="lead text-secondary mb-4">
                Advanced monitoring and analytics for your Autoclaved Aerated Concrete
                production facility with real-time insights and predictive analysis.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button className="btn btn-primary btn-lg px-4 py-2">
                  Request Demo
                </button>
                <button className="btn btn-outline-secondary btn-lg px-4 py-2">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          
          {/* Right column - Image and stats */}
          <div className="col-lg-6">
            <div className="position-relative">
              <div className="hero-image-container shadow rounded-4 overflow-hidden p-2 bg-white">
                <Image
                  src="/aac-block.jpg"
                  alt="AAC Plant Dashboard"
                  width={600}
                  height={400}
                  className="img-fluid rounded-3"
                  priority
                />
              </div>
              
              {/* Top-right floating badge */}
              <div className="position-absolute top-0 end-0 translate-middle-y me-4">
                <div className="bg-white p-3 rounded-4 shadow-lg">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary-subtle p-3 rounded-circle me-3">
                      <i className="bi bi-graph-up-arrow text-primary fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">97%</h5>
                      <p className="mb-0 small text-muted">Quality Improvement</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom-left floating badge */}
              <div className="position-absolute bottom-0 start-0 translate-middle-y ms-4">
                <div className="bg-white p-3 rounded-4 shadow-lg">
                  <div className="d-flex align-items-center">
                    <div className="bg-success-subtle p-3 rounded-circle me-3">
                      <i className="bi bi-arrow-down text-success fs-4"></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">-42%</h5>
                      <p className="mb-0 small text-muted">Rejection Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;