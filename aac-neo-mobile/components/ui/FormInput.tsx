import React from 'react';
import { StyleSheet, View, TextInput, Text, TextInputProps } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

interface FormInputProps extends TextInputProps {
    label: string;
    error?: string;
    icon?: string;
    required?: boolean;
}

export function FormInput({
    label,
    error,
    icon,
    required = false,
    ...inputProps
}: FormInputProps) {
    const colorScheme = useColorScheme();

    return (
        <View style={styles.inputGroup}>
            <ThemedText type="label" style={styles.inputLabel}>
                {label} {required && '*'}
            </ThemedText>

            <View style={[
                styles.inputWrapper,
                error ? styles.inputError : null
            ]}>
                {icon && (
                    <FontAwesome
                        name={icon as any}
                        size={18}
                        color="#00D2E6"
                        style={styles.inputIcon}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                    {...inputProps}
                />
            </View>

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        overflow: 'hidden',
    },
    inputIcon: {
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 8,
        fontSize: 16,
        color: '#333333',
    },
    inputError: {
        borderColor: '#ff4d4f',
        borderWidth: 1,
    },
    errorText: {
        color: '#ff4d4f',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});