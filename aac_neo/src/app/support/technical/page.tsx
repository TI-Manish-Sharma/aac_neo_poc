// src/app/support/technical/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Server, Database, BarChart2, RefreshCw } from 'lucide-react';

export default function TechnicalSupport() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/support" className="inline-flex items-center text-cyan-500 hover:text-cyan-700 mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Support Center
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Technical Support</h1>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Common Technical Issues</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <Server className="w-5 h-5 text-cyan-500 mr-2" />
                            <h3 className="font-medium text-gray-800">Dashboard Not Loading</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                            If your dashboard isn&apos;t loading or displays errors, try these steps:
                        </p>
                        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                            <li>Clear your browser cache and cookies</li>
                            <li>Try using a different browser</li>
                            <li>Check your internet connection</li>
                            <li>Verify your access permissions</li>
                        </ol>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <BarChart2 className="w-5 h-5 text-cyan-500 mr-2" />
                            <h3 className="font-medium text-gray-800">Chart Visualization Issues</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                            If charts aren&apos;t rendering correctly or showing no data:
                        </p>
                        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                            <li>Check that your date filters are set correctly</li>
                            <li>Verify data exists for the selected period</li>
                            <li>Try refreshing the dashboard</li>
                            <li>Ensure your browser is up to date</li>
                        </ol>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <Database className="w-5 h-5 text-cyan-500 mr-2" />
                            <h3 className="font-medium text-gray-800">Data Synchronization</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                            If you&apos;re experiencing data synchronization issues:
                        </p>
                        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                            <li>Check your API connection status</li>
                            <li>Verify that your data sources are online</li>
                            <li>Contact your system administrator to check server logs</li>
                            <li>Ensure proper authentication credentials</li>
                        </ol>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <RefreshCw className="w-5 h-5 text-cyan-500 mr-2" />
                            <h3 className="font-medium text-gray-800">Performance Issues</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                            If the dashboard is loading slowly:
                        </p>
                        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                            <li>Reduce the date range in your filters</li>
                            <li>Close other resource-intensive applications</li>
                            <li>Try using a wired internet connection</li>
                            <li>Check with colleagues if they&apos;re experiencing similar issues</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">API Connection Troubleshooting</h2>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-2">API Connectivity Test</h3>
                        <p className="text-gray-600 text-sm mb-3">
                            Use this endpoint to test your API connection:
                        </p>
                        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                            GET https://api.aacneo.com/v1/health-check
                        </div>
                        <p className="text-gray-600 text-sm mt-2">
                            Expected response: <code className="bg-gray-100 px-1 py-0.5 rounded">{"{ \"status\": \"OK\", \"version\": \"1.x.x\" }"}</code>
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-2">Common API Error Codes</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Code</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 text-sm">
                                    <tr>
                                        <td className="px-4 py-2 whitespace-nowrap text-red-600 font-medium">401</td>
                                        <td className="px-4 py-2 whitespace-nowrap">Unauthorized</td>
                                        <td className="px-4 py-2">Check your API keys and authentication credentials</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 whitespace-nowrap text-red-600 font-medium">403</td>
                                        <td className="px-4 py-2 whitespace-nowrap">Forbidden</td>
                                        <td className="px-4 py-2">Your account doesn't have permission for this endpoint</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 whitespace-nowrap text-red-600 font-medium">429</td>
                                        <td className="px-4 py-2 whitespace-nowrap">Too Many Requests</td>
                                        <td className="px-4 py-2">You've exceeded the API rate limit, try again later</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 whitespace-nowrap text-red-600 font-medium">503</td>
                                        <td className="px-4 py-2 whitespace-nowrap">Service Unavailable</td>
                                        <td className="px-4 py-2">The API service is temporarily down, check status page</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="bg-cyan-50 border-l-4 border-cyan-500 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Need More Help?</h2>
                <p className="text-gray-600 mb-4">
                    If you&apos;ve tried the troubleshooting steps above and are still experiencing issues, please contact our technical support team.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link href="/support" className="bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Submit Support Ticket
                    </Link>
                    <a href="mailto:tech-support@aacneo.com" className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200">
                        Email Tech Support
                    </a>
                </div>
            </div>
        </div>
    );
}