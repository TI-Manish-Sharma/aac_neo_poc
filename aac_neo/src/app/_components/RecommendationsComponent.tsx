import React from 'react';
import { AlertTriangle, Lightbulb, ThumbsUp, TrendingDown } from 'lucide-react';

interface RecommendationsData {
    mouldPerformance: { mouldId: string; averageDefectsPerBatch: number }[];
    defectsByType: { type: string; count: number }[];
    defectsByPosition: { position: string; percentage: number }[];
    summary: { defectRate: number };
}

const RecommendationsComponent = ({ data }: { data: RecommendationsData }) => {
    if (!data) return null;

    // Generate recommendations based on data analysis
    const generateRecommendations = () => {
        const recommendations = [];

        // Calculate insights from data
        const highDefectMoulds = data.mouldPerformance
            .filter(mould => mould.averageDefectsPerBatch > 20)
            .map(mould => mould.mouldId);

        const mostCommonDefectType = [...data.defectsByType]
            .sort((a, b) => b.count - a.count)[0];

        const worstPositions = data.defectsByPosition
            .filter(pos => pos.percentage > 15)
            .map(pos => pos.position);

        // Add mould maintenance recommendation if there are high defect moulds
        if (highDefectMoulds.length > 0) {
            recommendations.push({
                type: 'critical',
                title: 'Schedule Mould Maintenance',
                description: `Moulds ${highDefectMoulds.join(', ')} are showing high defect rates. Consider inspecting and scheduling maintenance for these moulds to reduce defects.`,
                icon: <AlertTriangle size={24} />,
                color: 'text-danger'
            });
        }

        // Process parameter recommendations based on defect analysis
        if (data.summary.defectRate > 10) {
            recommendations.push({
                type: 'process',
                title: 'Optimize Process Parameters',
                description: `Consider adjusting water content and hardness settings. Batches with "UNDER" or "OVER" rising quality show significantly more defects. Target optimal hardness range of 135-145 for better quality.`,
                icon: <TrendingDown size={24} />,
                color: 'text-warning'
            });
        }

        // Defect type specific recommendation
        if (mostCommonDefectType) {
            let defectRecommendation = '';

            switch (mostCommonDefectType.type) {
                case 'Rain Cracks/Cuts':
                    defectRecommendation = 'Consider adjusting curing conditions and humidity levels to reduce rain cracks. Review mixing time and temperature control.';
                    break;
                case 'Corner Cracks/Cuts':
                    defectRecommendation = 'Inspect cutting equipment and adjust cutting timing. Review mould release procedures.';
                    break;
                case 'Corner Damage':
                    defectRecommendation = 'Improve handling procedures during demoulding and transportation. Train operators on proper handling techniques.';
                    break;
                case 'Chipped Blocks':
                    defectRecommendation = 'Review stacking and transportation methods. Consider adjusting hardness before cutting to reduce chipping.';
                    break;
                default:
                    defectRecommendation = 'Analyze root causes and develop targeted mitigation plans.';
            }

            recommendations.push({
                type: 'defect',
                title: `Address ${mostCommonDefectType.type} Issues`,
                description: defectRecommendation,
                icon: <Lightbulb size={24} />,
                color: 'text-primary'
            });
        }

        // Position-specific recommendation
        if (worstPositions.length > 0) {
            recommendations.push({
                type: 'position',
                title: 'Optimize Problem Positions',
                description: `Positions ${worstPositions.join(', ')} show higher defect rates. Investigate potential causes such as uneven temperature distribution, mould wear, or process variations affecting these positions.`,
                icon: <TrendingDown size={24} />,
                color: 'text-info'
            });
        }

        // If everything looks good
        if (recommendations.length === 0) {
            recommendations.push({
                type: 'success',
                title: 'Process is Running Well',
                description: 'All quality indicators are within acceptable ranges. Continue current practices and monitor for any changes.',
                icon: <ThumbsUp size={24} />,
                color: 'text-success'
            });
        }

        return recommendations;
    };

    const recommendations = generateRecommendations();

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="card bg-light">
                    <div className="card-body">
                        <h2 className="h5 fw-semibold mb-3">Recommendations & Insights</h2>

                        {recommendations.length === 0 ? (
                            <p className="text-muted">No recommendations available for the current data.</p>
                        ) : (
                            <div className="row g-3">
                                {recommendations.map((rec, index) => (
                                    <div className="col-md-6" key={index}>
                                        <div className="card shadow-sm">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className={`me-2 ${rec.color}`}>
                                                        {rec.icon}
                                                    </div>
                                                    <h3 className="h6 fw-bold mb-0">{rec.title}</h3>
                                                </div>
                                                <p className="card-text small mb-0">{rec.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationsComponent;