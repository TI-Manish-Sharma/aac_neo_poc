'use client'
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Navigation links array for better maintainability
    const navLinks = [
        { href: "/", label: "Home" },
        // Uncomment when these pages are ready
        // { href: "/features", label: "Features" },
        // { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    // Handle scroll event to add shadow when scrolled
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMenuOpen && event.target && !(event.target as HTMLElement).closest('nav')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    // Close mobile menu when resizing to desktop view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={`bg-white py-3 fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/aac-neo-logo-wo-tagline.png"
                            alt="AAC Neo Icon"
                            width={60}
                            height={60}
                            className="transition-transform hover:scale-105"
                            priority
                        />
                    </Link>

                    {/* Mobile menu button with improved accessibility */}
                    <button
                        className="md:hidden block text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-md p-1"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-800 hover:text-cyan-400 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-300 after:transition-all hover:after:w-full"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/dashboard"
                            className="bg-cyan-400 text-white px-5 py-2 rounded-full hover:bg-cyan-500 transition-colors hover:shadow-md flex items-center"
                        >
                            <span>Dashboard</span>
                            <svg
                                className="ml-1 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Mobile Navigation with animation */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex flex-col space-y-4 pt-4 pb-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-800 hover:text-cyan-400 font-medium pl-1 border-l-4 border-transparent hover:border-cyan-500 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/dashboard"
                            className="bg-cyan-400 text-white px-5 py-2 rounded-full hover:bg-cyan-500 transition-colors inline-flex items-center w-fit"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span>Dashboard</span>
                            <svg
                                className="ml-1 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}