import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TextInputProps } from 'react-native';
import {
    FontAwesome, FontAwesome5, FontAwesome6,
    Ionicons, MaterialCommunityIcons, MaterialIcons, Entypo
} from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

interface FormInputProps extends TextInputProps {
    label: string;
    error?: string;
    icon?: string;
    iconFamily?: 'FontAwesome' | 'FontAwesome5' | 'FontAwesome6' | 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'Entypo' | string;
    required?: boolean;
}

export function FormInput({
    label,
    error,
    icon,
    iconFamily = 'FontAwesome',
    required = false,
    value,
    onFocus,
    ...inputProps
}: FormInputProps) {
    const colorScheme = useColorScheme();
    const inputRef = useRef<TextInput>(null);
    const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(undefined);

    // Clear selection after initial auto-select
    useEffect(() => {
        if (selection) {
            const timer = setTimeout(() => {
                setSelection(undefined);
            }, 50); // just after first render

            return () => clearTimeout(timer);
        }
    }, [selection]);

    const renderIcon = () => {
        if (!icon) return null;

        const iconProps = {
            name: icon as any,
            size: 18,
            color: "#00D2E6",
            style: styles.inputIcon
        };

        switch (iconFamily) {
            case 'FontAwesome5':
                return <FontAwesome5 {...iconProps} />;
            case 'FontAwesome6':
                return <FontAwesome6 {...iconProps} />;
            case 'Ionicons':
                return <Ionicons {...iconProps} />;
            case 'MaterialIcons':
                return <MaterialIcons {...iconProps} />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons {...iconProps} />;
            case 'Entypo':
                return <Entypo {...iconProps} />;
            default:
                return <FontAwesome {...iconProps} />;
        }
    };

    const handleFocus = (e: any) => {
        if (value?.toString().trim() === '0') {
            setSelection({ start: 0, end: value.length });
        }

        if (onFocus) onFocus(e);
    };

    return (
        <View style={styles.inputGroup}>
            <ThemedText type="label" style={styles.inputLabel}>
                {label} {required && '*'}
            </ThemedText>

            <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                {renderIcon()}

                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={value}
                    selection={selection}
                    onFocus={handleFocus}
                    placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                    {...inputProps}
                />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
