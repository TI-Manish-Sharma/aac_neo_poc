import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type FormStatusIndicatorProps = {
    completedSections: Record<string, boolean>;
    totalSections: number;
    formStatus: 'in-progress' | 'completed';
};

export const FormStatusIndicator: React.FC<FormStatusIndicatorProps> = ({
    completedSections,
    totalSections,
    formStatus
}) => {
    const completedCount = useMemo(() => {
        return Object.values(completedSections).filter(Boolean).length;
    }, [completedSections]);

    const progressPercentage = useMemo(() => {
        return Math.floor((completedCount / totalSections) * 100);
    }, [completedCount, totalSections]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                        {formStatus === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                    </Text>
                </View>
                <Text style={styles.progressText}>
                    {completedCount} of {totalSections} sections
                </Text>
            </View>

            <View style={styles.progressBarContainer}>
                <View
                    style={[
                        styles.progressBar,
                        { width: `${progressPercentage}%` },
                        formStatus === 'completed' ? styles.progressBarCompleted : {}
                    ]}
                />
            </View>

            <View style={styles.detailsContainer}>
                {formStatus === 'completed' ? (
                    <View style={styles.messageRow}>
                        <FontAwesome name="check-circle" size={16} color="#4CAF50" style={styles.icon} />
                        <Text style={styles.completedMessage}>
                            Form is complete and locked for editing
                        </Text>
                    </View>
                ) : (
                    <View style={styles.messageRow}>
                        <FontAwesome name="info-circle" size={16} color="#00A3B4" style={styles.icon} />
                        <Text style={styles.inProgressMessage}>
                            {progressPercentage === 100
                                ? 'All sections saved. Click "Mark as Complete" to finalize.'
                                : 'Save each section before marking as complete'}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#00A3B4',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        backgroundColor: '#00A3B4',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        marginBottom: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#00A3B4',
        borderRadius: 3,
    },
    progressBarCompleted: {
        backgroundColor: '#4CAF50',
    },
    detailsContainer: {
        marginTop: 4,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    completedMessage: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
    inProgressMessage: {
        fontSize: 14,
        color: '#666',
        flexShrink: 1,
    },
});