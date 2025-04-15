import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    FlatList,
    TextInput,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { BatchRecord } from '@/types/batch.types';

// Extended batch type with process stages
interface ExtendedBatchRecord extends BatchRecord {
    stages: {
        batching: 'completed' | 'in-progress' | 'pending';
        ferryCart: 'completed' | 'in-progress' | 'pending';
        tilting: 'completed' | 'in-progress' | 'pending';
        cutting: 'completed' | 'in-progress' | 'pending';
        autoclave: 'completed' | 'in-progress' | 'pending';
        segregation: 'completed' | 'in-progress' | 'pending';
    };
}

// Mock data for batches
const MOCK_BATCHES: ExtendedBatchRecord[] = [
    {
        id: '1',
        batchNumber: 'B001',
        mouldNumber: 'M001',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in-progress',
        stages: {
            batching: 'completed',
            ferryCart: 'completed',
            tilting: 'completed',
            cutting: 'completed',
            autoclave: 'in-progress',
            segregation: 'pending'
        }
    },
    {
        id: '2',
        batchNumber: 'B002',
        mouldNumber: 'M002',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in-progress',
        stages: {
            batching: 'completed',
            ferryCart: 'completed',
            tilting: 'in-progress',
            cutting: 'pending',
            autoclave: 'pending',
            segregation: 'pending'
        }
    },
    {
        id: '3',
        batchNumber: 'B003',
        mouldNumber: 'M003',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        stages: {
            batching: 'completed',
            ferryCart: 'completed',
            tilting: 'completed',
            cutting: 'completed',
            autoclave: 'completed',
            segregation: 'completed'
        }
    },
    {
        id: '4',
        batchNumber: 'B004',
        mouldNumber: 'M004',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        stages: {
            batching: 'completed',
            ferryCart: 'completed',
            tilting: 'completed',
            cutting: 'completed',
            autoclave: 'completed',
            segregation: 'completed'
        }
    },
    {
        id: '5',
        batchNumber: 'A001',
        mouldNumber: 'M005',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in-progress',
        stages: {
            batching: 'completed',
            ferryCart: 'completed',
            tilting: 'completed',
            cutting: 'in-progress',
            autoclave: 'pending',
            segregation: 'pending'
        }
    },
    {
        id: '6',
        batchNumber: 'A002',
        mouldNumber: 'M006',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        stages: {
            batching: 'completed',
            ferryCart: 'completed',
            tilting: 'completed',
            cutting: 'completed',
            autoclave: 'completed',
            segregation: 'completed'
        }
    },
    {
        id: '7',
        batchNumber: 'C001',
        mouldNumber: 'M007',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        stages: {
            batching: 'completed',
            ferryCart: 'completed',
            tilting: 'completed',
            cutting: 'completed',
            autoclave: 'completed',
            segregation: 'completed'
        }
    },
    {
        id: '8',
        batchNumber: 'C002',
        mouldNumber: 'M008',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        stages: {
            batching: 'completed',
            ferryCart: 'completed',
            tilting: 'completed',
            cutting: 'completed',
            autoclave: 'completed',
            segregation: 'completed'
        }
    }
];

export default function SearchBatchScreen() {
    const colorScheme = useColorScheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBatches, setFilteredBatches] = useState<ExtendedBatchRecord[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<ExtendedBatchRecord | null>(null);

    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.95))[0];
    const headerAnim = useState(new Animated.Value(0))[0];

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
            }),
        ]).start();
    }, []);

    // Perform search when search button is pressed
    const handleSearch = () => {
        setHasSearched(true);
        if (searchQuery.trim() === '') {
            setFilteredBatches([]);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = MOCK_BATCHES.filter(
                batch =>
                    batch.batchNumber.toLowerCase().includes(query) ||
                    batch.mouldNumber.toLowerCase().includes(query)
            );
            setFilteredBatches(filtered);
        }
    };

    // Clear search results when query is cleared
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredBatches([]);
        }
    }, [searchQuery]);

    const handleBatchSelect = (batch: ExtendedBatchRecord) => {
        setSelectedBatch(batch);
    };

    const toggleExpandBatch = () => {
        setSelectedBatch(null);
    };

    const goBack = () => {
        if (selectedBatch) {
            setSelectedBatch(null);
        } else {
            router.back();
        }
    };

    const getStatusColor = (status: 'completed' | 'in-progress' | 'pending') => {
        switch (status) {
            case 'completed':
                return '#2E8B57'; // Green
            case 'in-progress':
                return '#FFD700'; // Yellow
            case 'pending':
                return '#D3D3D3'; // Light gray
            default:
                return '#D3D3D3';
        }
    };

    const renderTimelineStage = (stageName: string, status: 'completed' | 'in-progress' | 'pending') => {
        const isCompleted = status === 'completed';
        const isInProgress = status === 'in-progress';

        return (
            <View style={styles.timelineStageContainer}>
                <View style={styles.timelineLine}>
                    <View style={[
                        styles.timelineLeftLine,
                        { backgroundColor: isCompleted || isInProgress ? '#2E8B57' : '#D3D3D3' }
                    ]} />
                    <View style={[
                        styles.timelineRightLine,
                        { backgroundColor: isCompleted ? '#2E8B57' : '#D3D3D3' }
                    ]} />
                </View>
                <View style={[
                    styles.timelineDot,
                    { backgroundColor: getStatusColor(status) }
                ]} />
                <Text style={styles.timelineStageName}>{stageName}</Text>
            </View>
        );
    };

    const renderBatchItem = ({ item }: { item: ExtendedBatchRecord }) => {
        const createdDate = new Date(item.createdAt);
        const formattedDate = createdDate.toLocaleDateString();

        return (
            <Animated.View
                style={[
                    styles.batchItemContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.batchItem}
                    onPress={() => handleBatchSelect(item)}
                    activeOpacity={0.7}
                >
                    <View style={styles.batchDetails}>
                        <View style={styles.batchHeader}>
                            <ThemedText style={styles.batchNumber}>
                                Batch #{item.batchNumber}
                            </ThemedText>
                            <View style={[
                                styles.statusIndicator,
                                { backgroundColor: item.status === 'in-progress' ? '#FFD700' : '#2E8B57' }
                            ]} />
                        </View>
                        <ThemedText style={styles.mouldNumber}>
                            Mould: {item.mouldNumber}
                        </ThemedText>
                        <ThemedText style={styles.createdDate}>
                            Created: {formattedDate}
                        </ThemedText>
                    </View>
                    <View style={styles.chevronContainer}>
                        <FontAwesome
                            name="chevron-right"
                            size={16}
                            color={Colors[colorScheme ?? 'light'].text}
                            style={styles.chevronIcon}
                        />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderBatchDetail = () => {
        if (!selectedBatch) return null;

        const editableStages = ['batching', 'ferryCart', 'tilting', 'cutting'] as const;

        // Find the currently in-progress editable stage (if any)
        const currentEditableStage = editableStages.find(
            stage => selectedBatch.stages[stage] === 'in-progress'
        );

        const handleEdit = () => {
            if (!currentEditableStage) return;

            const screenMapping: Record<string, string> = {
                batching: '/(tabs)/(screens)/(batch-screens)/batching-form',
                ferryCart: '/(tabs)/(screens)/(batch-screens)/ferry-cart-form',
                tilting: '/(tabs)/(screens)/(batch-screens)/tilting-form',
                cutting: '/(tabs)/(screens)/(batch-screens)/cutting-form',
            };

            const screenPath = screenMapping[currentEditableStage];

            router.push({
                pathname: screenPath,
                params: {
                    batchNumber: selectedBatch.batchNumber,
                    mouldNumber: selectedBatch.mouldNumber,
                },
            });
        };

        return (
            <Animated.View
                style={[
                    styles.batchDetailContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <View style={styles.batchDetailHeader}>
                    <View>
                        <ThemedText style={styles.batchDetailTitle}>
                            Batch #{selectedBatch.batchNumber}
                        </ThemedText>
                        <ThemedText style={styles.batchDetailMould}>
                            Mould: {selectedBatch.mouldNumber}
                        </ThemedText>
                    </View>
                    <View style={styles.batchDetailActions}>
                        {currentEditableStage && (
                            <TouchableOpacity
                                style={styles.batchDetailAction}
                                onPress={handleEdit}
                            >
                                <FontAwesome name="pencil" size={20} color="#555" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.batchDetailAction}
                            onPress={toggleExpandBatch}
                        >
                            <FontAwesome name="chevron-up" size={20} color="#555" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.timelineContainer}>
                    {renderTimelineStage('Batching', selectedBatch.stages.batching)}
                    {renderTimelineStage('Ferry Cart', selectedBatch.stages.ferryCart)}
                    {renderTimelineStage('Tilting', selectedBatch.stages.tilting)}
                    {renderTimelineStage('Cutting', selectedBatch.stages.cutting)}
                    {renderTimelineStage('Autoclave', selectedBatch.stages.autoclave)}
                    {renderTimelineStage('Segregation', selectedBatch.stages.segregation)}
                </View>
            </Animated.View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
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
                                Search Batch
                            </ThemedText>
                        </View>
                        <FontAwesome
                            name="search"
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

            {/* Batch Detail View - Shows when a batch is selected */}
            {selectedBatch ? (
                renderBatchDetail()
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    {/* Search Input */}
                    <Animated.View
                        style={[
                            styles.searchContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }],
                            }
                        ]}
                    >
                        <View style={styles.searchInputContainer}>
                            <FontAwesome name="search" size={18} color="#00D2E6" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by batch or mould number..."
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                returnKeyType="search"
                                autoCapitalize="characters"
                                onSubmitEditing={handleSearch}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSearchQuery('');
                                        setHasSearched(false);
                                    }}
                                    style={styles.clearButton}
                                >
                                    <FontAwesome name="times-circle" size={18} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={handleSearch}
                            disabled={searchQuery.trim() === ''}
                        >
                            <LinearGradient
                                colors={['#00D2E6', '#0088cc']}
                                style={[
                                    styles.searchButtonGradient,
                                    searchQuery.trim() === '' ? styles.disabledButton : {}
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.searchButtonText}>Search</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Results List - Only shown after search is performed */}
                    {hasSearched && (
                        <Animated.View
                            style={[
                                styles.resultsContainer,
                                {
                                    opacity: fadeAnim,
                                    flex: 1,
                                }
                            ]}
                        >
                            {filteredBatches.length > 0 ? (
                                <FlatList
                                    data={filteredBatches}
                                    renderItem={renderBatchItem}
                                    keyExtractor={(item) => item.id}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.listContent}
                                />
                            ) : (
                                <View style={styles.noResultsContainer}>
                                    <FontAwesome name="exclamation-circle" size={48} color="#CCCCCC" />
                                    <ThemedText style={styles.noResultsText}>No matching batches found</ThemedText>
                                </View>
                            )}
                        </Animated.View>
                    )}

                    {/* Instruction text when no search performed */}
                    {!hasSearched && (
                        <View style={styles.instructionContainer}>
                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    transform: [{ scale: scaleAnim }],
                                    alignItems: 'center'
                                }}
                            >
                                <FontAwesome name="search" size={64} color="#CCCCCC" />
                            </Animated.View>
                        </View>
                    )}
                </KeyboardAvoidingView>
            )}

            {/* Footer with legend */}
            {!selectedBatch && (
                <LinearGradient
                    colors={colorScheme === 'dark' ?
                        ['rgba(0,40,50,0.8)', 'rgba(0,40,50,0.5)'] :
                        ['rgba(230,247,255,0.8)', 'rgba(204,242,255,0.5)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.enhancedFooterGradient}
                >
                    <View style={styles.extendedLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendIndicator, { backgroundColor: '#2E8B57' }]} />
                            <ThemedText style={styles.legendText}>Completed</ThemedText>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendIndicator, { backgroundColor: '#FFD700' }]} />
                            <ThemedText style={styles.legendText}>In Progress</ThemedText>
                        </View>
                    </View>
                </LinearGradient>
            )}

            {/* Extended Footer for Batch Detail View */}
            {selectedBatch && (
                <LinearGradient
                    colors={colorScheme === 'dark' ?
                        ['rgba(0,40,50,0.8)', 'rgba(0,40,50,0.5)'] :
                        ['rgba(230,247,255,0.8)', 'rgba(204,242,255,0.5)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.enhancedFooterGradient}
                >
                    <View style={styles.extendedLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendIndicator, { backgroundColor: '#2E8B57' }]} />
                            <ThemedText style={styles.legendText}>Completed</ThemedText>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendIndicator, { backgroundColor: '#FFD700' }]} />
                            <ThemedText style={styles.legendText}>In Progress</ThemedText>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendIndicator, { backgroundColor: '#D3D3D3' }]} />
                            <ThemedText style={styles.legendText}>Pending</ThemedText>
                        </View>
                    </View>
                </LinearGradient>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: '#00A3B4',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    headerContainer: {
        width: '100%',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        zIndex: 10,
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
        // Icon styling if needed
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
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 12,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        height: '100%',
    },
    clearButton: {
        padding: 5,
    },
    searchButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    searchButtonGradient: {
        width: '100%',
        paddingVertical: 14,
        alignItems: 'center',
    },
    searchButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    disabledButton: {
        opacity: 0.5,
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listContent: {
        paddingBottom: 80, // Space for footer
    },
    instructionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    instructionText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },
    batchItemContainer: {
        marginBottom: 10,
    },
    batchItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0F7FA',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    batchDetails: {
        flex: 1,
    },
    batchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    batchNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginLeft: 8,
    },
    mouldNumber: {
        fontSize: 16,
        marginBottom: 4,
    },
    createdDate: {
        fontSize: 14,
        opacity: 0.7,
    },
    chevronContainer: {
        justifyContent: 'center',
        paddingLeft: 10,
    },
    chevronIcon: {
        opacity: 0.5,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60,
    },
    noResultsText: {
        fontSize: 18,
        marginTop: 16,
        color: '#999999',
    },
    batchDetailContainer: {
        flex: 1,
        margin: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    batchDetailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    batchDetailTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    batchDetailMould: {
        fontSize: 16,
        marginTop: 4,
    },
    batchDetailActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    batchDetailAction: {
        padding: 8,
        marginLeft: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 12,
    },
    timelineContainer: {
        marginTop: 20,
        flex: 1,
    },
    timelineStageContainer: {
        marginBottom: 24,
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        flexDirection: 'row',
        height: 2,
        width: '100%',
        marginTop: 12, // Center with the dot
    },
    timelineLeftLine: {
        flex: 1,
        height: 2,
        marginRight: 24, // Space for the dot
    },
    timelineRightLine: {
        flex: 1,
        height: 2,
    },
    timelineDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        position: 'absolute',
        left: '50%',
        marginLeft: -12, // Half the width
        zIndex: 1,
    },
    timelineStageName: {
        textAlign: 'center',
        marginTop: 25, // Below the dot and line
        fontSize: 14,
        fontWeight: '500',
    },
    enhancedFooterContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        zIndex: 5,
    },
    enhancedFooterGradient: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    extendedLegend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    legendIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
    },
});