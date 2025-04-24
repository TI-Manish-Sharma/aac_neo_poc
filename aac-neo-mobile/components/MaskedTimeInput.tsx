import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TextInput } from 'react-native';
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
    const hoursRef = useRef<TextInput>(null);
    const minutesRef = useRef<TextInput>(null);

    const [hourSelection, setHourSelection] = useState<{ start: number; end: number }>();
    const [minuteSelection, setMinuteSelection] = useState<{ start: number; end: number }>();

    useEffect(() => {
        if (hourSelection) {
            const t = setTimeout(() => setHourSelection(undefined), 50);
            return () => clearTimeout(t);
        }
    }, [hourSelection]);

    useEffect(() => {
        if (minuteSelection) {
            const t = setTimeout(() => setMinuteSelection(undefined), 50);
            return () => clearTimeout(t);
        }
    }, [minuteSelection]);

    const handleHoursChange = (text: string) => {
        let hours = text.replace(/[^0-9]/g, '');
        if (hours.length > 0) {
            const hoursNum = parseInt(hours);
            if (hoursNum > 23) hours = '23';
        }
        onChange({ ...value, hours });
    };

    const handleMinutesChange = (text: string) => {
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
                        ref={hoursRef}
                        style={styles.timeInput}
                        placeholder="HH"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={value.hours}
                        selection={hourSelection}
                        onFocus={() => {
                            if (value.hours.trim() === '0') {
                                setHourSelection({ start: 0, end: value.hours.length });
                            }
                        }}
                        onChangeText={handleHoursChange}
                    />
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={[styles.timeInputContainer, error ? styles.errorInput : null]}>
                    <MaskInput
                        ref={minutesRef}
                        style={styles.timeInput}
                        placeholder="MM"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={value.minutes}
                        selection={minuteSelection}
                        onFocus={() => {
                            if (value.minutes.trim() === '0') {
                                setMinuteSelection({ start: 0, end: value.minutes.length });
                            }
                        }}
                        onChangeText={handleMinutesChange}
                    />
                </View>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    timeContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#444',
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
    timeInput: {
        flex: 1,
        height: 48,
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
    errorInput: {
        borderColor: '#ff4d4f',
    },
    errorText: {
        color: '#ff4d4f',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
