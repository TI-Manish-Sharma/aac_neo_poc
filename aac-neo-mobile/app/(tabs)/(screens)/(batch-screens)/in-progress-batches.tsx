import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Animated,
    ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useBatch, UiBatch, BatchStages, BatchStageStatus } from '@/context/BatchContext';

const { width, height } = Dimensions.get('window');

// Status indicator component
const StatusIndicator: React.FC<{ status: BatchStageStatus; label: string; onPress?: () => void }> = ({ status, label, onPress }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return '#2E8B57'; // Dark green
            case 'in-progress':
                return '#FFD700'; // Yellow
            case 'pending':
                return '#D3D3D3'; // Light gray
            default:
                return '#D3D3D3';
        }
    };

    return (
        <TouchableOpacity
            style={styles.statusItem}
            disabled={!onPress}
            onPress={onPress}
        >
            <View
                style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor() }
                ]}
            />
            <ThemedText style={styles.statusLabel}>{label}</ThemedText>
        </TouchableOpacity>
    );
};

const BatchCard: React.FC<{
    batch: UiBatch;
    onEdit: (batch: UiBatch) => void;
    onStagePress: (batch: UiBatch, stageName: string) => void
}> = ({ batch, onEdit, onStagePress }) => {
    const colorScheme = useColorScheme();
    const [expanded, setExpanded] = useState(false);

    // Find which stage is currently in progress
    const getCurrentStage = (): { stageName: string, label: string } | null => {
        const stageMap: { [key: string]: string } = {
            'batching': 'Batching',
            'ferryCart': 'Ferry Cart',
            'tilting': 'Tilting',
            'cutting': 'Cutting',
            'autoclave': 'Autoclave',
            'segregation': 'Segregation'
        };

        for (const [key, value] of Object.entries(batch.stages)) {
            if (value === 'in-progress') {
                return { stageName: key, label: stageMap[key] };
            }
        }
        return null;
    };

    const currentStage = getCurrentStage();

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
                    {!expanded && currentStage && (
                        <View style={styles.currentStageContainer}>
                            <View style={styles.currentStageDot} />
                            <ThemedText style={styles.currentStageText}>
                                {currentStage.label} in progress
                            </ThemedText>
                        </View>
                    )}
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        onPress={() => onEdit(batch)}
                        style={styles.editButton}
                    >
                        <FontAwesome
                            name="pencil"
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

                    <View style={styles.statusGrid}>
                        <StatusIndicator
                            status={batch.stages.batching}
                            label="Batching"
                            onPress={() => onStagePress(batch, 'batching')}
                        />
                        <StatusIndicator
                            status={batch.stages.ferryCart}
                            label="Ferry Cart"
                            onPress={() => onStagePress(batch, 'ferryCart')}
                        />
                        <StatusIndicator
                            status={batch.stages.tilting}
                            label="Tilting"
                            onPress={() => onStagePress(batch, 'tilting')}
                        />
                        <StatusIndicator
                            status={batch.stages.cutting}
                            label="Cutting"
                            onPress={() => onStagePress(batch, 'cutting')}
                        />
                        <StatusIndicator
                            status={batch.stages.autoclave}
                            label="Autoclave"
                            onPress={() => onStagePress(batch, 'autoclave')}
                        />
                        <StatusIndicator
                            status={batch.stages.segregation}
                            label="Segregation"
                            onPress={() => onStagePress(batch, 'segregation')}
                        />
                    </View>

                    <View style={styles.batchInfo}>
                        <ThemedText style={styles.batchDetail}>Mould: {batch.mouldNumber}</ThemedText>
                        <ThemedText style={styles.batchDetail}>
                            Created: {new Date(batch.createdAt).toLocaleDateString()}
                        </ThemedText>
                    </View>
                </>
            )}
        </View>
    );
};

export default function InProgressBatches() {
    const colorScheme = useColorScheme();
    const [uiBatches, setUiBatches] = useState<UiBatch[]>([]);
    const { isLoading, getBatchesByStatus, convertToUiBatch, updateBatchStage } = useBatch();

    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.9))[0];
    const headerAnim = useState(new Animated.Value(0))[0];

    // Load data from context when component mounts
    useEffect(() => {
        if (!isLoading) {
            const inProgressBatches = getBatchesByStatus('In Progress');
            const convertedBatches = inProgressBatches.map(batch => convertToUiBatch(batch));
            setUiBatches(convertedBatches);
        }
    }, [isLoading, getBatchesByStatus, convertToUiBatch]);

    // Initial animations
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(headerAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const navigateToStageForm = (batch: UiBatch, stageName: string) => {
        // Get the status of the current stage
        const stageStatus = batch.stages[stageName as keyof BatchStages];

        // Only navigate if the status is 'in-progress'
        if (stageStatus === 'in-progress') {
            const screenMapping: Record<string, "/(tabs)/(screens)/(batch-screens)/batching-form"> = {
                batching: '/(tabs)/(screens)/(batch-screens)/batching-form',
                // Add other mappings as they become available
            };

            const screenPath = screenMapping[stageName];
            if (screenPath) {
                router.push({
                    pathname: screenPath,
                    params: {
                        batchNumber: batch.batchNumber,
                        mouldNumber: batch.mouldNumber
                    }
                });

                console.log("Navigating to:", screenPath, "with params:", {
                    batchNumber: batch.batchNumber,
                    mouldNumber: batch.mouldNumber
                });
            }
        }
    };

    const handleEditBatch = (batch: UiBatch) => {
        // Find the current in-progress stage
        const stageNames = ['batching', 'ferryCart', 'tilting', 'cutting', 'autoclave', 'segregation'];
        const currentStage = stageNames.find(stage =>
            batch.stages[stage as keyof BatchStages] === 'in-progress'
        );

        if (currentStage) {
            navigateToStageForm(batch, currentStage);
        } else {
            // If no stage is in progress, determine which one should be next
            const pendingStage = stageNames.find(stage =>
                batch.stages[stage as keyof BatchStages] === 'pending'
            );

            if (pendingStage) {
                // Alert is kept similar to maintain functionality
                alert(`The next stage is ${pendingStage}. Would you like to start it?`);

                // Update batch stages in context
                updateBatchStage(batch.batchNumber, pendingStage as keyof BatchStages, 'in-progress');

                // Update local UI state
                setUiBatches(prev =>
                    prev.map(b => {
                        if (b.batchNumber === batch.batchNumber) {
                            const updatedStages = { ...b.stages };
                            updatedStages[pendingStage as keyof BatchStages] = 'in-progress';
                            return { ...b, stages: updatedStages, status: 'in-progress' };
                        }
                        return b;
                    })
                );

                // Navigate to the form for this stage
                const updatedBatch = {
                    ...batch,
                    stages: { ...batch.stages, [pendingStage]: 'in-progress' as BatchStageStatus }
                };
                navigateToStageForm(updatedBatch, pendingStage);
            } else {
                alert('All stages for this batch have been completed.');
            }
        }
    };

    const handleStagePress = (batch: UiBatch, stageName: string) => {
        const stageStatus = batch.stages[stageName as keyof BatchStages];

        if (stageStatus === 'in-progress') {
            navigateToStageForm(batch, stageName);
        }
    };

    const goBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <ThemedView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#00D2E6" />
                <ThemedText style={{ marginTop: 20 }}>Loading batches...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {/* Enhanced Header Section with left back button and right-aligned content */}
            <Animated.View
                style={[
                    styles.headerContainer,
                    {
                        opacity: headerAnim,
                        transform: [{
                            translateY: headerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-20, 0]
                            })
                        }]
                    }
                ]}
            >
                <LinearGradient
                    colors={colorScheme === 'dark' ?
                        ['#004052', '#002535'] :
                        ['#e6f7ff', '#ccf2ff']}
                    style={styles.headerGradient}
                >
                    {/* Back button on left side */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={goBack}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={18}
                            color={Colors[colorScheme ?? 'light'].tint}
                        />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>

                    {/* Right-aligned header content */}
                    <View style={styles.headerContent}>
                        <View style={styles.headerTextContainer}>
                            <ThemedText type="subtitle" style={styles.headerSubtitle}>
                                Batch Management
                            </ThemedText>
                            <ThemedText type="title" style={styles.headerTitle}>
                                In Progress Batches
                            </ThemedText>
                        </View>
                        <FontAwesome
                            name="hourglass-half"
                            size={28}
                            color={Colors[colorScheme ?? 'light'].tint}
                            style={styles.headerIcon}
                        />
                    </View>

                    {/* Right-aligned divider */}
                    <View style={styles.headerDividerContainer}>
                        <View style={styles.headerDivider} />
                    </View>
                </LinearGradient>
            </Animated.View>

            {/* Batch Cards */}
            <FlatList
                data={uiBatches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BatchCard
                        batch={item}
                        onEdit={handleEditBatch}
                        onStagePress={handleStagePress}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="info-circle" size={40} color="#00D2E6" />
                        <ThemedText style={styles.emptyText}>
                            No batches are currently in progress
                        </ThemedText>
                    </View>
                }
            />

            {/* Legend */}
            <LinearGradient
                colors={colorScheme === 'dark' ?
                    ['rgba(0,40,50,0.8)', 'rgba(0,40,50,0.5)'] :
                    ['rgba(230,247,255,0.8)', 'rgba(204,242,255,0.5)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.enhancedFooterGradient}
            >
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.statusIndicator, { backgroundColor: '#2E8B57' }]} />
                        <ThemedText style={styles.legendText}>Completed</ThemedText>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.statusIndicator, { backgroundColor: '#FFD700' }]} />
                        <ThemedText style={styles.legendText}>In Progress</ThemedText>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.statusIndicator, { backgroundColor: '#D3D3D3' }]} />
                        <ThemedText style={styles.legendText}>Pending</ThemedText>
                    </View>
                </View>
            </LinearGradient>
        </ThemedView>
    );
}

const FOOTER_HEIGHT = 80;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        width: '100%',
        marginBottom: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerGradient: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 16,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    backButtonText: {
        color: '#00D2E6',
        marginLeft: 5,
        fontWeight: '600',
        fontSize: 14,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: 80,
        paddingRight: 10,
    },
    headerTextContainer: {
        alignItems: 'flex-end',
        marginRight: 15,
    },
    headerIcon: {
        // Icon is now on the right
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    headerSubtitle: {
        fontSize: 14,
        opacity: 0.8,
        textAlign: 'right',
    },
    headerDividerContainer: {
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    headerDivider: {
        height: 2,
        width: '40%',
        backgroundColor: '#00D2E6',
        marginTop: 10,
        borderRadius: 2,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: FOOTER_HEIGHT + 20,
    },
    batchCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
    editButton: {
        marginRight: 14,
        padding: 2,
    },
    batchNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    currentStageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    currentStageDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFD700',
        marginRight: 6,
    },
    currentStageText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 12,
    },
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statusItem: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        marginRight: 8,
    },
    statusLabel: {
        fontSize: 14,
    },
    batchInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    batchDetail: {
        fontSize: 12,
    },
    enhancedFooterGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    legendText: {
        marginLeft: 8,
        fontSize: 14,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    }
});