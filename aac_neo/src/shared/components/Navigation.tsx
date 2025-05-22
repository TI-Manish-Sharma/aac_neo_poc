'use client'
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from 'lucide-react';

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [dashboardOpen, setDashboardOpen] = useState(false);
    const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
    const [mobileDashboardOpen, setMobileDashboardOpen] = useState(false);
    const resourcesRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Navigation links array for better maintainability
    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/features", label: "Features" },
        { href: "/contact", label: "Contact" },
        { href: "/about", label: "About" },
    ];

    const dashboardLinks = [
        { href: "/dashboard/analytics", label: "Analytics" },
        { href: "/dashboard/operations", label: "Realtime" }
    ];

    // Resources dropdown items
    const resourceLinks = [
        { href: "/documentation", label: "Documentation" },
        { href: "/support", label: "Support" },
        { href: "/faq", label: "FAQ" },
    ];

    // Handle scroll event to add shadow when scrolled
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
                setResourcesOpen(false);
            }
            if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
                setDashboardOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [resourcesRef, dashboardRef]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMenuOpen && event.target && !(event.target as HTMLElement).closest('nav')) {
                setIsMenuOpen(false);
                setMobileResourcesOpen(false);
                setMobileDashboardOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    // Close mobile menu when resizing to desktop view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                if (isMenuOpen) {
                    setIsMenuOpen(false);
                }
                setMobileResourcesOpen(false);
                setMobileDashboardOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            setMobileResourcesOpen(false);
            setMobileDashboardOpen(false);
        }
    };

    const toggleResources = () => {
        setResourcesOpen(!resourcesOpen);
    };

    const toggleDashboard = () => {
        setDashboardOpen(!dashboardOpen);
    };

    const toggleMobileResources = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMobileResourcesOpen(!mobileResourcesOpen);
    };

    const toggleMobileDashboard = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMobileDashboardOpen(!mobileDashboardOpen);
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

                        {/* Dashboard Dropdown */}
                        <div className="relative" ref={dashboardRef}>
                            <button
                                onClick={toggleDashboard}
                                className="flex items-center text-gray-800 hover:text-cyan-400 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-300 after:transition-all hover:after:w-full"
                                aria-expanded={dashboardOpen}
                            >
                                Dashboard
                                <ChevronDown size={16} className={`ml-1 transition-transform ${dashboardOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dashboardOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    {dashboardLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-cyan-500"
                                            onClick={() => setDashboardOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Resources Dropdown */}
                        <div className="relative" ref={resourcesRef}>
                            <button
                                onClick={toggleResources}
                                className="flex items-center text-gray-800 hover:text-cyan-400 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-300 after:transition-all hover:after:w-full"
                                aria-expanded={resourcesOpen}
                            >
                                Resources
                                <ChevronDown size={16} className={`ml-1 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {resourcesOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    {resourceLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-cyan-500"
                                            onClick={() => setResourcesOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation with animation */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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

                        {/* Mobile Dashboard Dropdown */}
                        <div className="space-y-2">
                            <button
                                onClick={toggleMobileDashboard}
                                className="flex items-center justify-between w-full text-left text-gray-800 hover:text-cyan-400 font-medium pl-1 border-l-4 border-transparent hover:border-cyan-500 transition-colors"
                                aria-expanded={mobileDashboardOpen}
                            >
                                <span>Dashboard</span>
                                <ChevronDown size={16} className={`transition-transform ${mobileDashboardOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`pl-4 space-y-2 overflow-hidden transition-all duration-200 ${mobileDashboardOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                {dashboardLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block text-gray-700 hover:text-cyan-500 pl-2 border-l-2 border-gray-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Resources Dropdown */}
                        <div className="space-y-2">
                            <button
                                onClick={toggleMobileResources}
                                className="flex items-center justify-between w-full text-left text-gray-800 hover:text-cyan-400 font-medium pl-1 border-l-4 border-transparent hover:border-cyan-500 transition-colors"
                                aria-expanded={mobileResourcesOpen}
                            >
                                <span>Resources</span>
                                <ChevronDown size={16} className={`transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`pl-4 space-y-2 overflow-hidden transition-all duration-200 ${mobileResourcesOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                {resourceLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block text-gray-700 hover:text-cyan-500 pl-2 border-l-2 border-gray-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}