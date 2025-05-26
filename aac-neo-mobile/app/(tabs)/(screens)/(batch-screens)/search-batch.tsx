import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Animated,
    TextInput,
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
import { ScreenFooter } from '@/components/ui/ScreenFooter';
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

export default function SearchBatchScreen() {
    const colorScheme = useColorScheme();
    const { batches, isLoading, convertToUiBatch, updateBatchStage } = useBatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UiBatch[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const { fadeAnimation: fadeAnim, headerAnimation: headerAnim, bannerAnimation: bannerAnim } = useAnimations();

    // Handle search
    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        // Convert search query to lowercase for case-insensitive search
        const query = searchQuery.toLowerCase();

        // Search by batch number or mould number
        const filteredBatches = batches.filter(batch =>
            batch.batchId.toLowerCase().includes(query) ||
            batch.mouldId.toLowerCase().includes(query)
        );

        // Convert BatchRecord objects to UiBatch objects for the UI
        const uiBatches = filteredBatches.map(convertToUiBatch);

        setSearchResults(uiBatches);
        setHasSearched(true);
    };

    // Clear search results
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
    };

    // Handle batch selection
    const handleSelectBatch = (batch: UiBatch) => {
        // Simply display batch details in an alert for both completed and in-progress batches
        alert(`Viewing batch details for ${batch.batchNumber}`);
    };

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

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <ScreenHeader
                title="Search Batches"
                subtitle="Batch Management"
                icon='search'
                headerAnim={headerAnim}
                onBack={() => {
                    // Optional custom back logic here
                    router.back();
                }} />

            {/* Search Bar */}
            <Animated.View
                style={[
                    styles.searchBarContainer,
                    {
                        opacity: bannerAnim,
                        transform: [{
                            translateY: bannerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [10, 0]
                            })
                        }]
                    }
                ]}
            >
                <View style={styles.searchBar}>
                    <FontAwesome
                        name="search"
                        size={18}
                        color="#999999"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by batch # or mould #"
                        placeholderTextColor="#999999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                        autoCapitalize="characters"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearSearch}
                        >
                            <FontAwesome name="times-circle" size={18} color="#999999" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <LinearGradient
                        colors={['#00D2E6', '#0088cc']}
                        style={styles.searchButtonGradient}
                    >
                        <Text style={styles.searchButtonText}>Search</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            {/* Search Results */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00D2E6" />
                    <ThemedText style={{ marginTop: 10 }}>Loading batches...</ThemedText>
                </View>
            ) : (
                <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                    {hasSearched ? (
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <BatchCard
                                    batch={item}
                                    onEdit={handleEditBatch}
                                    onStagePress={handleStagePress}
                                />
                                // <BatchCard
                                //     batch={item}
                                //     onSelect={handleSelectBatch}
                                //     onStagePress={(batch, stageName) => {
                                //         // This is just a display in search view - no navigation
                                //         const stageStatus = batch.stages[stageName as keyof BatchStages];
                                //         if (stageStatus === 'in-progress') {
                                //             alert(`Stage ${stageName} is in progress for batch ${batch.batchNumber}`);
                                //         }
                                //     }}
                                // />
                            )}
                            contentContainerStyle={[
                                styles.listContent,
                                searchResults.length === 0 && styles.emptyListContent
                            ]}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyStateContainer}>
                                    <FontAwesome name="search" size={60} color="#cccccc" />
                                    <ThemedText style={styles.emptyStateText}>
                                        No batches found matching "{searchQuery}"
                                    </ThemedText>
                                </View>
                            }
                        />
                    ) : (
                        <View style={styles.initialStateContainer}>
                            <FontAwesome name="database" size={60} color="#cccccc" />
                            <ThemedText style={styles.initialStateText}>
                                Search for batches by batch number or mould number
                            </ThemedText>
                            <ThemedText style={styles.batchCountText}>
                                {batches.length} batches available
                            </ThemedText>
                        </View>
                    )}
                </Animated.View>
            )}

            {/* Footer */}
            <ScreenFooter
                text="Find and view batch details easily"
                fadeAnim={fadeAnim}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    searchBarContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginRight: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333333',
    },
    clearButton: {
        padding: 5,
    },
    searchButton: {
        height: 50,
        width: 80,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    searchButtonGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 80, // Space for footer
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    initialStateText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        textAlign: 'center',
        color: '#666666',
    },
    batchCountText: {
        fontSize: 14,
        marginTop: 10,
        color: '#00A3B4',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        textAlign: 'center',
    },

    // BatchCard styles
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
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editButton: {
        marginRight: 14,
        padding: 2,
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    batchNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mouldNumber: {
        fontSize: 14,
        opacity: 0.8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
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

    // Expanded card items
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 12,
    },
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    statusItem: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusLabel: {
        fontSize: 14,
    },
    batchInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    batchDetail: {
        fontSize: 14,
        color: '#666666',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    viewDetailsText: {
        fontSize: 14,
        color: '#00A3B4',
        fontWeight: '500',
    },
    createdDate: {
        fontSize: 14,
        color: '#666666',
    }
});