'use client';
import React from 'react';
import { Section } from './types';

// Documentation data structure
export const documentationSections: Section[] = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        content: (
            <div>
                <h3 className="text-xl font-semibold mb-4">Welcome to AAC Neo</h3>
                <p className="mb-4">
                    AAC Neo provides comprehensive monitoring and analytics for your Autoclaved Aerated Concrete (AAC) production facility. This documentation will help you understand how to use the dashboard effectively.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">System Requirements</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Modern web browser (Chrome, Firefox, Safari, or Edge)</li>
                    <li>Internet connection to access real-time data</li>
                    <li>Display resolution of 1280×720 or higher (recommended)</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-3">Accessing the Dashboard</h4>
                <p className="mb-4">
                    To access the AAC Neo dashboard:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2">
                    <li>Navigate to the AAC Neo website and log in with your credentials</li>
                    <li>Click on the "Dashboard" button in the navigation bar</li>
                    <li>You will be directed to the main dashboard page with various analytics tabs</li>
                </ol>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded">
                    <p className="text-blue-700">
                        <strong>Note:</strong> Your admin may have provided you with specific login credentials.
                        If you're having trouble accessing the dashboard, please contact your system administrator.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        content: (
            <div>
                <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
                <p className="mb-4">
                    The AAC Neo dashboard is divided into four main sections, each providing different insights into your production process.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="text-lg font-medium mb-2 text-cyan-600">Overview</h4>
                        <p className="text-gray-700">Provides a high-level summary of current quality metrics including total batches, rejection rates, and most common rejection types.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="text-lg font-medium mb-2 text-cyan-600">Rejection Trends</h4>
                        <p className="text-gray-700">Displays historical data about rejection rates over time and allows you to analyze patterns by different rejection types.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="text-lg font-medium mb-2 text-cyan-600">Mould Performance</h4>
                        <p className="text-gray-700">Shows the performance of individual moulds, identifying which moulds have higher or lower rejection rates.</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="text-lg font-medium mb-2 text-cyan-600">Segregation Analysis</h4>
                        <p className="text-gray-700">Provides detailed analysis of defects by position, type, and batch to help identify specific quality issues.</p>
                    </div>
                </div>

                <h4 className="text-lg font-medium mt-8 mb-3">Common Dashboard Features</h4>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Date Filters:</strong> Most sections allow you to filter data by date range</li>
                    <li><strong>Refresh Button:</strong> Updates the data to show the latest information</li>
                    <li><strong>Export Options:</strong> Some sections allow you to export data for further analysis</li>
                    <li><strong>Interactive Charts:</strong> Hover over charts to see detailed information</li>
                </ul>
            </div>
        )
    },
    {
        id: 'cutting-process',
        title: 'Cutting Process',
        content: (
            <div>
                <h3 className="text-xl font-semibold mb-4">Cutting Process Analysis</h3>
                <p className="mb-4">
                    The Cutting Process section provides real-time insights into the quality of your AAC production line, focusing on rejection rates and types.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Key Performance Indicators</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-sm font-medium text-cyan-600 mb-1">Total Batches</p>
                        <p className="text-gray-700">Shows the total number of batches produced in the selected time period</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-sm font-medium text-red-600 mb-1">Rejected Batches</p>
                        <p className="text-gray-700">Indicates how many batches failed quality checks</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-sm font-medium text-amber-600 mb-1">Rejection Rate</p>
                        <p className="text-gray-700">The percentage of batches that were rejected</p>
                    </div>
                </div>

                <h4 className="text-lg font-medium mt-6 mb-3">Production Overview</h4>
                <p className="mb-4">
                    The production overview chart shows the ratio of accepted to rejected batches. This pie chart provides a quick visual reference for your quality metrics.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Rejection by Type</h4>
                <p className="mb-4">
                    This bar chart breaks down rejections by cause:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Rain Cracks/Cuts:</strong> Defects resembling rain patterns on the surface</li>
                    <li><strong>Corner Cracks/Cuts:</strong> Damage occurring at block corners</li>
                    <li><strong>Corner Damage:</strong> Physical damage to corners during handling</li>
                    <li><strong>Chipped Blocks:</strong> Small pieces broken off from blocks</li>
                    <li><strong>Tilting Crane Issues:</strong> Problems during the tilting crane phase</li>
                    <li><strong>Side Cutter Issues:</strong> Defects related to the side cutting process</li>
                </ul>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6 rounded">
                    <p className="text-amber-700">
                        <strong>Tip:</strong> Pay close attention to your most common rejection type.
                        The dashboard highlights this information to help focus your quality improvement efforts.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: 'rejection-trends',
        title: 'Rejection Trends',
        content: (
            <div>
                <h3 className="text-xl font-semibold mb-4">Rejection Trends Analysis</h3>
                <p className="mb-4">
                    The Rejection Trends section provides historical analysis of your rejection rates over time,
                    allowing you to identify patterns and track improvement initiatives.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Filtering Options</h4>
                <p className="mb-4">
                    You can analyze trends using several filter options:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Date Range:</strong> Select start and end dates for your analysis</li>
                    <li><strong>Group By:</strong> Aggregate data by day, week, or month</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-3">Rejection Rate Trend Chart</h4>
                <p className="mb-4">
                    This line chart shows two key metrics over time:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Rejection Rate (%):</strong> Percentage of batches rejected over time</li>
                    <li><strong>Total Batches:</strong> Production volume for context</li>
                </ul>
                <p className="mb-4">
                    Use this chart to identify:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Periods with unusually high rejection rates</li>
                    <li>Correlation between production volume and quality</li>
                    <li>Long-term trends in rejection rates</li>
                    <li>Effects of quality improvement initiatives</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-3">Rejection Types Over Time</h4>
                <p className="mb-4">
                    This bar chart breaks down rejection rates by type for each time period, showing you which types of defects are contributing to your overall rejection rate over time.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Detailed Rejection Trends Table</h4>
                <p className="mb-4">
                    For more detailed analysis, the table at the bottom provides numerical data for all metrics shown in the charts. You can use this for precise reporting or further analysis.
                </p>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6 rounded">
                    <p className="text-green-700">
                        <strong>Best Practice:</strong> When implementing process improvements, use the "Group By" feature
                        to compare weekly or monthly data before and after your changes to measure their effectiveness.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: 'mould-performance',
        title: 'Mould Performance',
        content: (
            <div>
                <h3 className="text-xl font-semibold mb-4">Mould Performance Analysis</h3>
                <p className="mb-4">
                    The Mould Performance section helps you identify which moulds are performing well and which ones may require maintenance or replacement.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Filter Options</h4>
                <p className="mb-4">
                    Analyze mould performance using:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Date Range:</strong> Select the time period for analysis</li>
                    <li><strong>Mould ID Search:</strong> Focus on specific moulds</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-3">Summary Statistics</h4>
                <p className="mb-4">
                    The dashboard provides quick statistics:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Total Moulds:</strong> Number of moulds in analysis</li>
                    <li><strong>Average Rejection Rate:</strong> Mean rejection percentage across all moulds</li>
                    <li><strong>High-Risk Moulds:</strong> Count of moulds with rejection rates above 50%</li>
                    <li><strong>Good Performance:</strong> Count of moulds with rejection rates below 10%</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-3">Top Moulds by Rejection Rate</h4>
                <p className="mb-4">
                    The vertical bar chart shows moulds with the highest rejection rates. Use this to identify problematic moulds that need attention.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Mould Performance Table</h4>
                <p className="mb-4">
                    The detailed table provides:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Mould ID</li>
                    <li>Total batches produced</li>
                    <li>Number of rejected batches</li>
                    <li>Rejection rate percentage</li>
                </ul>
                <p className="mb-4">
                    You can sort this table by clicking on any column header.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Risk Analysis</h4>
                <p className="mb-4">
                    The risk analysis section categorizes moulds into risk levels:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>High Risk (&gt;50%):</strong> Moulds requiring immediate inspection</li>
                    <li><strong>Medium Risk (30-50%):</strong> Moulds that should be scheduled for maintenance</li>
                    <li><strong>Low Risk (10-30%):</strong> Moulds to monitor regularly</li>
                    <li><strong>Optimal (&lt;10%):</strong> Well-performing moulds</li>
                </ul>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded">
                    <p className="text-red-700">
                        <strong>Important:</strong> High-risk moulds can significantly impact your overall production quality.
                        Consider scheduling maintenance for these moulds as soon as possible.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: 'segregation-analysis',
        title: 'Segregation Analysis',
        content: (
            <div>
                <h3 className="text-xl font-semibold mb-4">Segregation Analysis</h3>
                <p className="mb-4">
                    The Segregation Analysis section provides detailed insights into defect patterns by position, type, and batch, helping you identify specific quality issues in your production process.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Navigation Tabs</h4>
                <p className="mb-4">
                    This section includes five tabs for detailed analysis:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Overview:</strong> Summary of key metrics and charts</li>
                    <li><strong>Defect Types:</strong> Analysis of different types of defects</li>
                    <li><strong>Position Analysis:</strong> Defects by position in the mould</li>
                    <li><strong>Mould Performance:</strong> Performance data for each mould</li>
                    <li><strong>Worst Batches:</strong> Details of batches with highest defect rates</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-3">Defect Type Distribution</h4>
                <p className="mb-4">
                    The pie chart shows the distribution of defects by type, helping you identify which defect types are most common.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Position Defect Analysis</h4>
                <p className="mb-4">
                    This section shows defects by position in the mould, using:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Stacked bar charts showing defect types by position</li>
                    <li>Radar charts displaying the distribution of defects across positions</li>
                    <li>Position summary tables with detailed metrics</li>
                </ul>
                <p className="mb-4">
                    Use this information to identify if certain positions in your moulds are consistently problematic.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">Recommendations</h4>
                <p className="mb-4">
                    The system provides automated recommendations based on your data, including:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Mould maintenance suggestions</li>
                    <li>Process parameter optimization</li>
                    <li>Defect-specific recommendations</li>
                    <li>Position-specific improvement ideas</li>
                </ul>

                <h4 className="text-lg font-medium mt-6 mb-3">Exporting Data</h4>
                <p className="mb-4">
                    You can export data from any tab using the download button. This creates a CSV file that you can open in spreadsheet software for further analysis or reporting.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded">
                    <p className="text-blue-700">
                        <strong>Analysis Tip:</strong> Cross-reference position data with mould performance to identify if specific mould+position combinations are causing quality issues.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: 'help-resources',
        title: 'Help Resources',
        content: (
            <div>
                <h3 className="text-xl font-semibold mb-4">Help Resources</h3>
                <p className="mb-6">
                    Need additional help with the AAC Neo dashboard? Our support resources are here to assist you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="text-lg font-medium mb-3 text-cyan-600">FAQ</h4>
                        <p className="text-gray-700 mb-4">
                            Find answers to frequently asked questions about using the AAC Neo dashboard.
                        </p>
                        <a href="/faq" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                            View FAQ
                        </a>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h4 className="text-lg font-medium mb-3 text-cyan-600">Support</h4>
                        <p className="text-gray-700 mb-4">
                            Troubleshooting guides and contact information for our support team.
                        </p>
                        <a href="/support" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                            Get Support
                        </a>
                    </div>
                </div>

                {/* <div className="mt-8">
                    <h4 className="text-lg font-medium mb-3">Additional Resources</h4>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <a href="/tutorials" className="text-cyan-600 hover:text-cyan-800">
                                Video Tutorials
                            </a>
                            <span className="text-gray-600"> - Step-by-step visual guides for using the dashboard</span>
                        </li>
                        <li>
                            <a href="/webinars" className="text-cyan-600 hover:text-cyan-800">
                                Webinars
                            </a>
                            <span className="text-gray-600"> - Recorded training sessions and feature demonstrations</span>
                        </li>
                        <li>
                            <a href="/glossary" className="text-cyan-600 hover:text-cyan-800">
                                Glossary
                            </a>
                            <span className="text-gray-600"> - Definitions of technical terms used in the dashboard</span>
                        </li>
                    </ul>
                </div> */}

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-8 rounded">
                    <p className="text-amber-700">
                        <strong>Need Help Now?</strong> For urgent technical assistance, contact us at support@aacneo.com or call +91 98765 43210 (Monday-Friday, 9:00 AM - 5:00 PM IST).
                    </p>
                </div>
            </div>
        )
    }
];
