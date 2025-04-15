import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Platform,
    ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    icon?: string;
}

export function TimePicker({
    label,
    value,
    onChange,
    error,
    required = false,
    icon = 'clock-o'
}: TimePickerProps) {
    const [date, setDate] = useState<Date>(() => {
        // Parse the time string if it exists, otherwise use current time
        if (value) {
            const [time, period] = value.split(' ');
            const [hours, minutes] = time.split(':').map(Number);

            const date = new Date();
            let hour = hours;

            // Handle AM/PM
            if (period && period.toUpperCase() === 'PM' && hours < 12) {
                hour += 12;
            } else if (period && period.toUpperCase() === 'AM' && hours === 12) {
                hour = 0;
            }

            date.setHours(hour, minutes || 0);
            return date;
        }
        return new Date();
    });

    const [show, setShow] = useState(false);

    const onChange24Hour = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        // Format time in 12-hour format with AM/PM
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        const formattedMinutes = minutes.toString().padStart(2, '0');

        const timeString = `${formattedHours}:${formattedMinutes} ${period}`;
        onChange(timeString);
    };

    const showTimepicker = () => {
        setShow(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label} {required && '*'}
            </Text>
            <TouchableOpacity
                style={[styles.inputContainer, error ? styles.errorInput : null]}
                onPress={showTimepicker}
            >
                <FontAwesome name={icon as any} size={18} color="#00D2E6" style={styles.icon} />
                <Text style={[styles.valueText, !value ? styles.placeholderText : null]}>
                    {value || "Select time"}
                </Text>
                <FontAwesome name="angle-down" size={18} color="#888" />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {show && (
                Platform.OS === 'ios' ? (
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={show}
                    >
                        <TouchableOpacity
                            style={styles.modalOverlay}
                            activeOpacity={1}
                            onPress={() => setShow(false)}
                        >
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <TouchableOpacity onPress={() => setShow(false)}>
                                        <Text style={styles.modalCancel}>Cancel</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.modalTitle}>Select Time</Text>
                                    <TouchableOpacity onPress={() => setShow(false)}>
                                        <Text style={styles.modalDone}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    testID="timePicker"
                                    themeVariant="light"
                                    value={date}
                                    mode="time"
                                    is24Hour={false}
                                    display="spinner"
                                    positiveButton={{label: 'OK', textColor: '#00D2E6'}}
                                    negativeButton={{label: 'Cancel', textColor: '#ff4d4f'}}
                                    onChange={onChange24Hour}
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>
                ) : (
                    <DateTimePicker
                        testID="timePicker"
                        value={date}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={onChange24Hour}
                    />
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#444',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        paddingVertical: 10,
        paddingHorizontal: 12,
        height: 50,
    },
    icon: {
        marginRight: 10,
    },
    valueText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    errorInput: {
        borderColor: '#ff4d4f',
    },
    errorText: {
        color: '#ff4d4f',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    modalCancel: {
        fontSize: 16,
        color: '#777',
    },
    modalDone: {
        fontSize: 16,
        color: '#00D2E6',
        fontWeight: '600',
    }
});