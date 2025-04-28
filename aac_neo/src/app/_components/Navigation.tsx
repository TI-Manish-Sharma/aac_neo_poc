'use client'
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
            <div className="container">
                <Link href="/" className="navbar-brand d-flex align-items-center">
                    <Image
                        src="/aac-neo-logo-wo-tagline.png"
                        alt="AAC Neo Icon"
                        width={60}
                        height={60}
                    />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link href="/" className="nav-link active">Home</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link href="/features" className="nav-link">Features</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/about" className="nav-link">About</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link href="/contact" className="nav-link">Contact</Link>
                        </li>
                        <li className="nav-item ms-lg-3">
                            <Link href="/dashboard" className="btn btn-primary rounded-pill px-4">Dashboard</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}