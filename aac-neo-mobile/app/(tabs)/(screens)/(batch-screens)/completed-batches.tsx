import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Animated,
    Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAnimations } from '@/hooks/useAnimations';

const { width, height } = Dimensions.get('window');

// Define batch status type
type BatchStatus = 'completed' | 'in-progress' | 'pending';

// Define batch type
interface Batch {
    id: string;
    batchNumber: string;
    mouldNumber: string;
    createdAt: string;
    completedAt: string;
    stages: {
        batching: BatchStatus;
        ferryCart: BatchStatus;
        tilting: BatchStatus;
        cutting: BatchStatus;
        autoclave: BatchStatus;
        segregation: BatchStatus;
    };
    qualityScore?: number;
    notes?: string;
}

const FOOTER_HEIGHT = 80;

// Quality Score component
const QualityScore: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = () => {
        if (score >= 90) return '#2E8B57'; // Excellent - dark green
        if (score >= 75) return '#5CB85C'; // Good - green
        if (score >= 60) return '#F0AD4E'; // Average - yellow/orange
        return '#D9534F';                  // Poor - red
    };

    return (
        <View style={[styles.qualityScoreContainer, { backgroundColor: getScoreColor() }]}>
            <Text style={styles.qualityScoreText}>{score}</Text>
        </View>
    );
};

const BatchCard: React.FC<{
    batch: Batch;
    onPress: (batch: Batch) => void;
}> = ({ batch, onPress }) => {
    const colorScheme = useColorScheme();
    const [expanded, setExpanded] = useState(false);

    const createdDate = new Date(batch.createdAt).toLocaleDateString();
    const completedDate = new Date(batch.completedAt).toLocaleDateString();

    // Calculate completion time in hours
    const startTime = new Date(batch.createdAt).getTime();
    const endTime = new Date(batch.completedAt).getTime();
    const completionTimeHours = Math.round((endTime - startTime) / (1000 * 60 * 60));

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <View style={styles.batchCard}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={toggleExpanded}
                activeOpacity={0.7}
            >
                <View style={styles.headerLeft}>
                    <ThemedText type="subtitle" style={styles.batchNumber}>
                        Batch #{batch.batchNumber}
                    </ThemedText>
                    {!expanded && batch.qualityScore && (
                        <View style={styles.headerSummary}>
                            <QualityScore score={batch.qualityScore} />
                            <ThemedText style={styles.completionInfo}>
                                Completed in {completionTimeHours} hrs
                            </ThemedText>
                        </View>
                    )}
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        onPress={() => onPress(batch)}
                        style={styles.viewButton}
                    >
                        <FontAwesome
                            name="file-text-o"
                            size={16}
                            color={Colors[colorScheme ?? 'light'].tint}
                        />
                    </TouchableOpacity>
                    <FontAwesome
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={Colors[colorScheme ?? 'light'].text}
                    />
                </View>
            </TouchableOpacity>

            {expanded && (
                <>
                    <View style={styles.divider} />

                    <View style={styles.stageStatusContainer}>
                        <View style={styles.stageStatusHeader}>
                            <Text style={styles.stageStatusTitle}>Process Status</Text>
                            {batch.qualityScore && (
                                <View style={styles.qualityScoreRow}>
                                    <Text style={styles.qualityScoreLabel}>Quality:</Text>
                                    <QualityScore score={batch.qualityScore} />
                                </View>
                            )}
                        </View>

                        <View style={styles.stageStatusGrid}>
                            {Object.entries(batch.stages).map(([stage, status]) => (
                                <View key={stage} style={styles.stageItem}>
                                    <View style={[
                                        styles.statusIndicator,
                                        { backgroundColor: '#2E8B57' }
                                    ]} />
                                    <Text style={styles.stageLabel}>
                                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.expandedInfo}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Mould:</Text>
                            <ThemedText style={styles.infoValue}>{batch.mouldNumber}</ThemedText>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Created:</Text>
                            <ThemedText style={styles.infoValue}>{createdDate}</ThemedText>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Completed:</Text>
                            <ThemedText style={styles.infoValue}>{completedDate}</ThemedText>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Duration:</Text>
                            <ThemedText style={styles.infoValue}>{completionTimeHours} hours</ThemedText>
                        </View>
                    </View>

                    {batch.notes && (
                        <View style={styles.notesSection}>
                            <Text style={styles.notesLabel}>Notes:</Text>
                            <ThemedText style={styles.notesText}>{batch.notes}</ThemedText>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

export default function CompletedBatchesScreen() {
    const colorScheme = useColorScheme();
    const [batches, setBatches] = useState<Batch[]>([]);
    const [filterActive, setFilterActive] = useState(false);
    const [sortOption, setSortOption] = useState<'date' | 'quality'>('date');

    const { fadeAnimation: fadeAnim, scaleAnimation: scaleAnim, headerAnimation: headerAnim } = useAnimations();

    // Mock data - in a real app, this would come from an API or database
    useEffect(() => {
        // Simulated delay to mimic API fetch
        const timer = setTimeout(() => {
            const mockBatches: Batch[] = [
                {
                    id: '1',
                    batchNumber: 'B001',
                    mouldNumber: 'M001',
                    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
                    completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
                    stages: {
                        batching: 'completed',
                        ferryCart: 'completed',
                        tilting: 'completed',
                        cutting: 'completed',
                        autoclave: 'completed',
                        segregation: 'completed'
                    },
                    qualityScore: 92,
                    notes: 'Excellent batch with optimal density and strength.'
                },
                {
                    id: '2',
                    batchNumber: 'B002',
                    mouldNumber: 'M002',
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
                    completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
                    stages: {
                        batching: 'completed',
                        ferryCart: 'completed',
                        tilting: 'completed',
                        cutting: 'completed',
                        autoclave: 'completed',
                        segregation: 'completed'
                    },
                    qualityScore: 85,
                    notes: 'Good quality with minor surface imperfections.'
                },
                {
                    id: '3',
                    batchNumber: 'B003',
                    mouldNumber: 'M003',
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
                    completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
                    stages: {
                        batching: 'completed',
                        ferryCart: 'completed',
                        tilting: 'completed',
                        cutting: 'completed',
                        autoclave: 'completed',
                        segregation: 'completed'
                    },
                    qualityScore: 78
                },
                {
                    id: '4',
                    batchNumber: 'B004',
                    mouldNumber: 'M004',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
                    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
                    stages: {
                        batching: 'completed',
                        ferryCart: 'completed',
                        tilting: 'completed',
                        cutting: 'completed',
                        autoclave: 'completed',
                        segregation: 'completed'
                    },
                    qualityScore: 65,
                    notes: 'Acceptable quality, but with some density inconsistencies.'
                },
                {
                    id: '5',
                    batchNumber: 'B005',
                    mouldNumber: 'M005',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                    stages: {
                        batching: 'completed',
                        ferryCart: 'completed',
                        tilting: 'completed',
                        cutting: 'completed',
                        autoclave: 'completed',
                        segregation: 'completed'
                    },
                    qualityScore: 55,
                    notes: 'Below standard quality, requires rework on several blocks.'
                },
                {
                    id: '6',
                    batchNumber: 'B006',
                    mouldNumber: 'M006',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                    stages: {
                        batching: 'completed',
                        ferryCart: 'completed',
                        tilting: 'completed',
                        cutting: 'completed',
                        autoclave: 'completed',
                        segregation: 'completed'
                    },
                    qualityScore: 95,
                    notes: 'Premium quality batch with perfect dimensions and strength.'
                }
            ];

            setBatches(mockBatches);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    // Sort batches based on selected option
    const sortedBatches = [...batches].sort((a, b) => {
        if (sortOption === 'date') {
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        } else {
            return (b.qualityScore || 0) - (a.qualityScore || 0);
        }
    });

    // Filter high quality batches (quality score > 85) if filter is active
    const displayedBatches = filterActive
        ? sortedBatches.filter(batch => (batch.qualityScore || 0) > 85)
        : sortedBatches;

    const handleViewBatchReport = (batch: Batch) => {
        // In a real app, this would navigate to a detailed report screen
        Alert.alert(
            `Batch Report: ${batch.batchNumber}`,
            `Quality Score: ${batch.qualityScore}\nCompleted: ${new Date(batch.completedAt).toLocaleDateString()}\n\n${batch.notes || 'No additional notes.'}`,
            [
                { text: "OK" }
            ]
        );
    };

    const toggleSortOption = () => {
        setSortOption(prev => prev === 'date' ? 'quality' : 'date');
    };

    const toggleFilter = () => {
        setFilterActive(prev => !prev);
    };

    const goBack = () => {
        router.back();
    };

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <FontAwesome name="check-circle" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>
                No completed batches found
            </ThemedText>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            {/* Enhanced Header Section with left back button and right-aligned content */}
            <ScreenHeader
                title="Completed Batches"
                subtitle="Batch Management"
                icon="check-square-o"
                headerAnim={headerAnim}
                onBack={() => {
                    // Optional custom back logic here
                    router.back();
                }} />

            {/* Filter and Sort Options */}
            <Animated.View style={[
                styles.optionsBar,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }
            ]}>
                <TouchableOpacity
                    style={[styles.optionButton, filterActive && styles.activeOptionButton]}
                    onPress={toggleFilter}
                >
                    <FontAwesome name="filter" size={14} color={filterActive ? '#fff' : '#00A3B4'} />
                    <Text style={[styles.optionText, filterActive && styles.activeOptionText]}>
                        High Quality
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={toggleSortOption}>
                    <FontAwesome
                        name={sortOption === 'date' ? 'calendar' : 'star'}
                        size={14}
                        color="#00A3B4"
                    />
                    <Text style={styles.optionText}>
                        Sort by: {sortOption === 'date' ? 'Date' : 'Quality'}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Batch Cards */}
            <FlatList
                data={displayedBatches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BatchCard
                        batch={item}
                        onPress={handleViewBatchReport}
                    />
                )}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: FOOTER_HEIGHT + 20 },
                    displayedBatches.length === 0 && styles.emptyListContent
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyList}
            />

            {/* Footer */}
            <LinearGradient
                colors={colorScheme === 'dark' ?
                    ['rgba(0,40,50,1)', 'rgba(0,40,50,1)'] :
                    ['rgba(230,247,255,1)', 'rgba(204,242,255,1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.enhancedFooterGradient}
            >
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{batches.length}</Text>
                        <Text style={styles.summaryLabel}>Total Batches</Text>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>
                            {batches.filter(batch => (batch.qualityScore || 0) > 85).length}
                        </Text>
                        <Text style={styles.summaryLabel}>High Quality</Text>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>
                            {batches.length > 0
                                ? Math.round(batches.reduce((sum, batch) => sum + (batch.qualityScore || 0), 0) / batches.length)
                                : 0}
                        </Text>
                        <Text style={styles.summaryLabel}>Avg. Quality</Text>
                    </View>
                </View>
            </LinearGradient>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    optionsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 210, 230, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    activeOptionButton: {
        backgroundColor: '#00A3B4',
    },
    optionText: {
        marginLeft: 6,
        color: '#00A3B4',
        fontWeight: '600',
        fontSize: 13,
    },
    activeOptionText: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    emptyListContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        opacity: 0.7,
    },
    batchCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0F7FA',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewButton: {
        marginRight: 14,
        padding: 2,
    },
    batchNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    completionInfo: {
        fontSize: 14,
        marginLeft: 8,
        color: '#555',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 12,
    },
    qualityScoreContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qualityScoreText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    stageStatusContainer: {
        marginBottom: 12,
    },
    stageStatusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    stageStatusTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    qualityScoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qualityScoreLabel: {
        fontSize: 14,
        color: '#555',
        marginRight: 8,
    },
    stageStatusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    stageItem: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 6,
    },
    stageLabel: {
        fontSize: 13,
        color: '#444',
    },
    expandedInfo: {
        marginTop: 8,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    infoLabel: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
    },
    notesSection: {
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 8,
    },
    notesLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
    },
    enhancedFooterGradient: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00A3B4',
    },
    summaryLabel: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
    },
    summaryDivider: {
        height: 30,
        width: 1,
        backgroundColor: 'rgba(0, 210, 230, 0.3)',
    }
});