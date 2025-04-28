import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact Us - AACI Institute</title>
                <meta name="description" content="Contact AACI Institute for more information" />
            </Head>

            <div className="container py-5">
                <h1 className="text-center mb-5">Contact Us</h1>

                <div className="row">
                    {/* Contact Information */}
                    <div className="col-md-5 mb-4 mb-md-0">
                        <div className="card h-100 shadow">
                            <div className="card-body">
                                <h2 className="card-title h4 mb-4">Get in Touch</h2>

                                <div className="mb-4">
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                            <i className="bi bi-geo-alt text-primary"></i>
                                        </div>
                                        <div>
                                            <h3 className="h6 mb-1">Address</h3>
                                            <p className="text-muted mb-0">123 Education Street, Hyderabad, India 500001</p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start mb-3">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                            <i className="bi bi-envelope text-primary"></i>
                                        </div>
                                        <div>
                                            <h3 className="h6 mb-1">Email</h3>
                                            <p className="text-muted mb-0">info@aaciinstitute.com</p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                            <i className="bi bi-telephone text-primary"></i>
                                        </div>
                                        <div>
                                            <h3 className="h6 mb-1">Phone</h3>
                                            <p className="text-muted mb-0">+91 98765 43210</p>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="h6 mb-3">Follow Us</h3>
                                <div className="d-flex gap-3 mb-4">
                                    <a href="#" className="text-primary fs-5"><i className="bi bi-facebook"></i></a>
                                    <a href="#" className="text-info fs-5"><i className="bi bi-twitter"></i></a>
                                    <a href="#" className="text-danger fs-5"><i className="bi bi-youtube"></i></a>
                                    <a href="#" className="text-primary fs-5"><i className="bi bi-linkedin"></i></a>
                                </div>

                                <div className="alert alert-info mb-0">
                                    <Link
                                        href="https://aacindiainstitute.com/contact-us"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="d-flex align-items-center justify-content-center text-decoration-none"
                                    >
                                        <span>Visit AAC India Institute Contact Page</span>
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="col-md-7">
                        <div className="card shadow">
                            <div className="card-body">
                                <h2 className="card-title h4 mb-4">Send us a Message</h2>

                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="subject" className="form-label">Subject</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="subject"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea
                                            className="form-control"
                                            id="message"
                                            rows="5"
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}