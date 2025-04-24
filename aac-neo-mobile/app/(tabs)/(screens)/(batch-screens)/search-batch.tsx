import React, { useState, useEffect } from 'react';
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
import { useBatch, BatchRecord, UiBatch } from '@/context/BatchContext';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { useAnimations } from '@/hooks/useAnimations';

const { width, height } = Dimensions.get('window');

// Component for each batch search result
const BatchCard: React.FC<{
    batch: UiBatch;
    onSelect: (batch: UiBatch) => void;
}> = ({ batch, onSelect }) => {
    const colorScheme = useColorScheme();

    // Get status color
    const getStatusColor = () => {
        return batch.status === 'completed' ? '#2E8B57' : '#FFD700';
    };

    // Format date for better readability
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <TouchableOpacity
            style={styles.batchCard}
            onPress={() => onSelect(batch)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <ThemedText type="subtitle" style={styles.batchNumber}>
                        Batch #{batch.batchNumber}
                    </ThemedText>
                    <View style={styles.statusContainer}>
                        <View
                            style={[
                                styles.statusIndicator,
                                { backgroundColor: getStatusColor() }
                            ]}
                        />
                        <ThemedText
                            style={[
                                styles.statusText,
                                { color: getStatusColor() }
                            ]}
                        >
                            {batch.status === 'completed' ? 'Completed' : 'In Progress'}
                        </ThemedText>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <ThemedText style={styles.mouldNumber}>
                        Mould: {batch.mouldNumber}
                    </ThemedText>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.batchInfo}>
                <ThemedText style={styles.createdDate}>
                    Created: {formatDate(batch.createdAt)}
                </ThemedText>

                <FontAwesome
                    name="angle-right"
                    size={20}
                    color="#00A3B4"
                />
            </View>
        </TouchableOpacity>
    );
};

export default function SearchBatchScreen() {
    const colorScheme = useColorScheme();
    const { batches, isLoading, convertToUiBatch } = useBatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UiBatch[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const { fadeAnim, headerAnim, bannerAnim } = useAnimations();

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
        if (batch.status === 'completed') {
            // Navigate to completed batch details (if you have a screen for this)
            alert(`Viewing completed batch ${batch.batchNumber}`);
        } else {
            // For in-progress batches, navigate to the in-progress batches screen
            router.push('/(tabs)/(screens)/(batch-screens)/in-progress-batches');
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
                                    onSelect={handleSelectBatch}
                                />
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
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        padding: 4,
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
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 12,
    },
    batchInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    createdDate: {
        fontSize: 14,
        color: '#666666',
    }
});