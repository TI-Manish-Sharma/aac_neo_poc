import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MaskInput from 'react-native-mask-input';

interface MaskedTimeInputProps {
    label: string;
    value: { hours: string; minutes: string };
    onChange: (value: { hours: string; minutes: string }) => void;
    error?: string;
    required?: boolean;
}

export function MaskedTimeInput({
    label,
    value,
    onChange,
    error,
    required = false
}: MaskedTimeInputProps) {

    const handleHoursChange = (text: string) => {
        // Only allow 0-23 for hours
        let hours = text.replace(/[^0-9]/g, '');
        if (hours.length > 0) {
            const hoursNum = parseInt(hours);
            if (hoursNum > 23) hours = '23';
        }

        onChange({ ...value, hours });
    };

    const handleMinutesChange = (text: string) => {
        // Only allow 0-59 for minutes
        let minutes = text.replace(/[^0-9]/g, '');
        if (minutes.length > 0) {
            const minutesNum = parseInt(minutes);
            if (minutesNum > 59) minutes = '59';
        }

        onChange({ ...value, minutes });
    };

    return (
        <View style={styles.timeContainer}>
            <Text style={styles.label}>
                {label} {required && '*'}
            </Text>
            <View style={styles.timeInputRow}>
                <View style={[styles.timeInputContainer, error ? styles.errorInput : null]}>
                    <FontAwesome name="clock-o" size={18} color="#00D2E6" style={styles.icon} />
                    <MaskInput
                        style={styles.timeInput}
                        placeholder="HH"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={value.hours}
                        onChangeText={handleHoursChange}
                    />
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={[styles.timeInputContainer, error ? styles.errorInput : null]}>
                    <MaskInput
                        style={styles.timeInput}
                        placeholder="MM"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={value.minutes}
                        onChangeText={handleMinutesChange}
                    />
                </View>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    timeContainer: {
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
    timeInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeInputContainer: {
        flex: 1,
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
    },
    timeInput: {
        flex: 1,
        height: 48,
        paddingVertical: 10,
        // paddingHorizontal: 8,
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    timeSeparator: {
        paddingHorizontal: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
    },
});