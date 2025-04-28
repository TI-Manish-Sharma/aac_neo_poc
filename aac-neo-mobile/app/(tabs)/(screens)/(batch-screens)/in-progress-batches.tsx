import React, { useState, useEffect, useMemo } from 'react';
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
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAnimations } from '@/hooks/useAnimations';
import { StatusIndicator } from '@/components/ui/StatusIndicator';

const { width, height } = Dimensions.get('window');

const BatchCard: React.FC<{
    batch: UiBatch;
    onEdit: (batch: UiBatch) => void;
    onStagePress: (batch: UiBatch, stageName: string) => void
}> = ({ batch, onEdit, onStagePress }) => {
    const colorScheme = useColorScheme();
    const [expanded, setExpanded] = useState(false);

    const getCurrentStage = (): { stageName: string; label: string } | null => {
        const stageMap: Record<string, string> = {
            batching: 'Batching',
            ferryCart: 'Ferry Cart',
            tilting: 'Tilting',
            cutting: 'Cutting',
            autoclave: 'Autoclave',
            segregation: 'Segregation'
        };

        //–– Special case: if everything up to cutting is done but autoclave remains pending,
        //    treat autoclave as the "current" step for display purposes:
        if (
            batch.stages.batching === 'completed' &&
            batch.stages.ferryCart === 'completed' &&
            batch.stages.tilting === 'completed' &&
            batch.stages.cutting === 'completed' &&
            batch.stages.autoclave === 'pending'
        ) {
            return { stageName: 'autoclave', label: stageMap['autoclave'] };
        }

        //–– Otherwise fall back to your normal in-progress lookup:
        for (const [key, value] of Object.entries(batch.stages)) {
            if (value === 'in-progress') {
                return { stageName: key, label: stageMap[key] };
            }
        }

        return null;
    };

    // New function to get modified stage status based on logical progression
    const getModifiedStageStatus = (stageName: string): BatchStageStatus => {
        // Original behavior for early stages
        if (stageName !== 'autoclave' && stageName !== 'segregation') {
            return batch.stages[stageName as keyof BatchStages];
        }
        
        // Special handling for autoclave and segregation
        const allPreviousCompleted = 
            batch.stages.batching === 'completed' &&
            batch.stages.ferryCart === 'completed' &&
            batch.stages.tilting === 'completed' &&
            batch.stages.cutting === 'completed';
            
        // For Autoclave stage handling
        if (stageName === 'autoclave') {
            return batch.stages.autoclave;
        }
        
        // For Segregation stage handling
        if (stageName === 'segregation') {
            // If Autoclave is completed and Segregation is in-progress, show yellow
            if (batch.stages.autoclave === 'completed' && batch.stages.segregation === 'in-progress') {
                return 'in-progress';
            }
            
            // If all previous stages including Autoclave are completed and Segregation is pending,
            // it should be shown as pending/gray
            if (allPreviousCompleted && batch.stages.autoclave === 'completed' && 
                batch.stages.segregation === 'pending') {
                return 'pending';
            }
            
            // If we're still at the Autoclave stage (pending or in-progress), 
            // Segregation should always be gray/pending
            if (allPreviousCompleted && 
                (batch.stages.autoclave === 'pending' || batch.stages.autoclave === 'in-progress')) {
                return 'pending';
            }
        }
        
        return batch.stages[stageName as keyof BatchStages];
    };

    const currentStage = getCurrentStage();

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const getCurrentStageDisplay = () => {
        if (!currentStage) return '';
        // if we're on the autoclave step, pick one of two messages
        if (currentStage.stageName === 'autoclave') {
            return batch.stages.autoclave === 'in-progress'
                ? 'Batch In Autoclave'
                : 'Ready for Autoclave';
        }
        // for all other stages, still use the "Ready for X" pattern
        return `Ready for ${currentStage.label}`;
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
                                {getCurrentStageDisplay()}
                            </ThemedText>
                        </View>
                    )}
                </View>
                <View style={styles.headerRight}>
                    {currentStage?.stageName !== 'autoclave' && (
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
                    )}
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
                            status={getModifiedStageStatus('batching')}
                            label="Batching"
                            onPress={() => onStagePress(batch, 'batching')}
                        />
                        <StatusIndicator
                            status={getModifiedStageStatus('ferryCart')}
                            label="Ferry Cart"
                            onPress={() => onStagePress(batch, 'ferryCart')}
                        />
                        <StatusIndicator
                            status={getModifiedStageStatus('tilting')}
                            label="Tilting"
                            onPress={() => onStagePress(batch, 'tilting')}
                        />
                        <StatusIndicator
                            status={getModifiedStageStatus('cutting')}
                            label="Cutting"
                            onPress={() => onStagePress(batch, 'cutting')}
                        />
                        <StatusIndicator
                            status={getModifiedStageStatus('autoclave')}
                            label="Autoclave"
                            onPress={() => onStagePress(batch, 'autoclave')}
                        />
                        <StatusIndicator
                            status={getModifiedStageStatus('segregation')}
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
    const { isLoading, getBatchesByStatus, convertToUiBatch, updateBatchStage } = useBatch();

    // Animation values
    const { headerAnim } = useAnimations();

    // Load data using useMemo
    const uiBatches = useMemo(() => {
        if (isLoading) return [];
        return getBatchesByStatus('In Progress').map(convertToUiBatch);
    }, [isLoading, getBatchesByStatus, convertToUiBatch]);

    const navigateToStageForm = (batch: UiBatch, stageName: string) => {
        // Get the status of the current stage
        const stageStatus = batch.stages[stageName as keyof BatchStages];

        // Only navigate if the status is 'in-progress'
        if (stageStatus === 'in-progress') {
            const screenMapping: Record<string, 
                "/(tabs)/(screens)/(batch-screens)/batching-form" |
                "/(tabs)/(screens)/(batch-screens)/ferry-cart-form" |
                "/(tabs)/(screens)/(batch-screens)/tilting-crane-form" |
                "/(tabs)/(screens)/(batch-screens)/cutting-form" |
                "/(tabs)/(screens)/(batch-screens)/segregation-form"
            > = {
                batching: '/(tabs)/(screens)/(batch-screens)/batching-form',
                ferryCart: '/(tabs)/(screens)/(batch-screens)/ferry-cart-form',
                tilting: '/(tabs)/(screens)/(batch-screens)/tilting-crane-form',
                cutting: '/(tabs)/(screens)/(batch-screens)/cutting-form',
                segregation: '/(tabs)/(screens)/(batch-screens)/segregation-form',
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
            <ScreenHeader title='In Progress Batches'
                subtitle='Batch Management'
                icon='hourglass-half'
                headerAnim={headerAnim}
                onBack={() => {
                    // Optional custom back logic here
                    router.back();
                }} />

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

            {/* Footer - Legend */}
            <LinearGradient
                colors={colorScheme === 'dark' ?
                    ['rgba(0,40,50,1)', 'rgba(0,40,50,1)'] :
                    ['rgba(230,247,255,1)', 'rgba(204,242,255,1)']}
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
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: FOOTER_HEIGHT + 20,
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
    statusIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        marginRight: 8,
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