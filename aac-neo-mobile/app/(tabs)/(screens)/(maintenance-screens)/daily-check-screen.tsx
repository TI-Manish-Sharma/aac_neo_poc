import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
    Alert,
    ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAnimations } from '@/hooks/useAnimations';

const { width, height } = Dimensions.get('window');

// Define the type of status
type CheckStatus = 'regular' | 'attention' | 'critical' | null;

// Define the maintenance task type
interface MaintenanceTask {
    id: string;
    equipment: string;
    task: string;
    status: CheckStatus;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    lastChecked?: string;
}

export default function DailyChecksScreen() {
    const { fadeAnimation: fadeAnim, scaleAnimation: scaleAnim, headerAnimation: headerAnim } = useAnimations();

    // State for the maintenance tasks
    const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
    const [loading, setLoading] = useState(true);

    // Load maintenance tasks (would come from an API in a real app)
    useEffect(() => {
        // Mock data based on the image
        const mockTasks: MaintenanceTask[] = [
            { id: '1', equipment: 'All Electric Motors', task: 'Check Currents', status: null, frequency: 'daily' },
            { id: '2', equipment: 'Sensors of Tracks - Autoclave', task: 'Sensors are functional', status: null, frequency: 'daily' },
            { id: '3', equipment: 'Sensors of Tracks - Raising', task: 'Sensors are functional', status: null, frequency: 'daily' },
            { id: '4', equipment: 'Pumps - Greasing and Bearing Check', task: 'Check the condition', status: null, frequency: 'daily' },
            { id: '5', equipment: 'Wire Rope on Tracks', task: 'Check the condition', status: null, frequency: 'daily' },
            { id: '6', equipment: 'Crane Wire Ropes', task: 'Check the condition', status: null, frequency: 'daily' },
            { id: '7', equipment: 'Plate Cleaning', task: 'Cleaning with Marble Polish M/C', status: null, frequency: 'daily' },
            { id: '8', equipment: 'Plate and Wagon Numbering', task: 'Check correctness', status: null, frequency: 'daily' },
            { id: '9', equipment: 'Gearbox - Tilting Crane RF and Updown', task: 'Check Oil Level', status: null, frequency: 'daily' },
            { id: '10', equipment: 'Gearbox - All Tanks', task: 'Check Oil Level', status: null, frequency: 'daily' },
            { id: '11', equipment: 'Gearbox - C/M Trolley', task: 'Check Oil Level', status: null, frequency: 'daily' },
            { id: '12', equipment: 'Gearbox - C/M ZigZag', task: 'Check Oil Level', status: null, frequency: 'daily' },
            { id: '13', equipment: 'Autoclave Wagons', task: 'Check and Repair Wagons', status: null, frequency: 'daily' },
        ];

        setTasks(mockTasks);
        setLoading(false);
    }, []);

    // Handle task status update
    const updateTaskStatus = (taskId: string, newStatus: CheckStatus) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId
                    ? { ...task, status: newStatus, lastChecked: new Date().toISOString() }
                    : task
            )
        );
    };

    // Render a single column with its status indicator
    const renderStatusColumn = (taskId: string, columnStatus: CheckStatus, currentStatus: CheckStatus) => {
        // Determine if this column is currently selected
        const isSelected = currentStatus === columnStatus;

        // Set the background color based on the column type and selection state
        let backgroundColor = 'transparent'; // Default is transparent when not selected

        if (isSelected) {
            // When selected, use the appropriate color for the status
            if (columnStatus === 'regular') backgroundColor = '#4CAF50'; // Green
            else if (columnStatus === 'attention') backgroundColor = '#FFA000'; // Amber
            else if (columnStatus === 'critical') backgroundColor = '#F44336'; // Red
        }

        return (
            <View style={styles.statusColumn}>
                <TouchableOpacity
                    style={[styles.statusIndicator, { backgroundColor }]}
                    onPress={() => {
                        // If already selected, deselect it (set to null)
                        // Otherwise, set to this column's status
                        const newStatus = isSelected ? null : columnStatus;
                        updateTaskStatus(taskId, newStatus);
                    }}
                />
            </View>
        );
    };

    // Save and submit the checks
    const handleSubmit = () => {
        // In a real app, you would make an API call here
        Alert.alert(
            "Submit Daily Checks",
            "Are you sure you want to submit these maintenance checks?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Submit",
                    onPress: () => {
                        Alert.alert("Success", "Daily checks submitted successfully!");
                        router.back();
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#00D2E6" />
                <Text style={{ marginTop: 20, color: '#666' }}>Loading maintenance tasks...</Text>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScreenHeader
                title='Daily Checks'
                subtitle='Maintenance System'
                icon='wrench'
                headerAnim={headerAnim}
                onBack={() => router.back()}
            />

            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* Legend for RAC */}
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                        <Text style={styles.legendText}>R - Regular</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#FFA000' }]} />
                        <Text style={styles.legendText}>A - Attention</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
                        <Text style={styles.legendText}>C - Critical</Text>
                    </View>
                </View>

                <View style={styles.tableContainer}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <View style={styles.equipmentColumn}>
                            <Text style={styles.headerText}>Equipment</Text>
                        </View>
                        <View style={styles.taskColumn}>
                            <Text style={styles.headerText}>Maintenance Task</Text>
                        </View>
                        <View style={styles.statusColumn}>
                            <Text style={styles.headerText}>R</Text>
                        </View>
                        <View style={styles.statusColumn}>
                            <Text style={styles.headerText}>A</Text>
                        </View>
                        <View style={styles.statusColumn}>
                            <Text style={styles.headerText}>C</Text>
                        </View>
                    </View>

                    {/* Table Content */}
                    <ScrollView style={styles.tableContent}>
                        {tasks.map((task) => (
                            <View key={task.id} style={styles.tableRow}>
                                <View style={styles.equipmentColumn}>
                                    <Text style={styles.cellText}>{task.equipment}</Text>
                                </View>
                                <View style={styles.taskColumn}>
                                    <Text style={styles.cellText}>{task.task}</Text>
                                </View>
                                {/* Render each status column individually */}
                                {renderStatusColumn(task.id, 'regular', task.status)}
                                {renderStatusColumn(task.id, 'attention', task.status)}
                                {renderStatusColumn(task.id, 'critical', task.status)}
                            </View>
                        ))}

                        {/* Extra padding at the bottom to ensure all content is visible above the footer */}
                        <View style={{ height: 80 }} />
                    </ScrollView>

                    {/* Submit Button - Fixed position above footer */}
                    {/* <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <LinearGradient
                                colors={['#00D2E6', '#0088cc']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.submitButtonText}>Submit Daily Checks</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View> */}
                </View>


            </Animated.View>

            <ScreenFooter
                text="Complete daily maintenance checks to ensure equipment reliability"
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: 'rgba(0, 210, 230, 0.1)',
        borderRadius: 8,
        marginBottom: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
        color: '#444',
    },
    tableContainer: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
        // marginBottom: 16, // Space for button container
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 12,
        backgroundColor: '#00A3B4',
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    equipmentColumn: {
        flex: 2,
        paddingHorizontal: 8,
    },
    taskColumn: {
        flex: 2,
        paddingHorizontal: 8,
    },
    statusColumn: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableContent: {
        flex: 1,
        backgroundColor: 'white',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    cellText: {
        fontSize: 14,
        color: '#333',
    },
    statusIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#999',
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'transparent',
    },
    submitButton: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});