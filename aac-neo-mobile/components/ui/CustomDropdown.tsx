// components/ui/CustomDropdown.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CustomDropdownProps {
    label: string;
    value: string;
    placeholder?: string;
    icon?: string;
    options: string[];
    error?: string;
    required?: boolean;
    onSelect: (option: string) => void;
    disabled?: boolean;
}

export function CustomDropdown({
    label,
    value,
    placeholder = 'Select an option',
    icon = 'chevron-down',
    options,
    error,
    required = false,
    onSelect
}: CustomDropdownProps) {
    const [showOptions, setShowOptions] = useState(false);

    const handleSelect = (option: string) => {
        onSelect(option);
        setShowOptions(false);
    };

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
                {label} {required && '*'}
            </Text>
            <TouchableOpacity
                style={[
                    styles.dropdownWrapper,
                    error ? styles.inputError : null
                ]}
                onPress={() => setShowOptions(true)}
            >
                {icon && (
                    <FontAwesome
                        name={icon as any}
                        size={18}
                        color="#00D2E6"
                        style={styles.inputIcon}
                    />
                )}
                <Text style={[
                    styles.dropdownText,
                    !value && styles.dropdownPlaceholder
                ]}>
                    {value || placeholder}
                </Text>
                <FontAwesome
                    name="chevron-down"
                    size={16}
                    color="#888"
                />
            </TouchableOpacity>
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            <Modal
                visible={showOptions}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowOptions(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowOptions(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Select {label.replace('*', '')}
                        </Text>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionItem,
                                    option === value && styles.selectedOption
                                ]}
                                onPress={() => handleSelect(option)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    option === value && styles.selectedOptionText
                                ]}>
                                    {option}
                                </Text>
                                {option === value && (
                                    <FontAwesome name="check" size={16} color="#00D2E6" />
                                )}
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowOptions(false)}
                        >
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#444',
    },
    dropdownWrapper: {
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
    inputIcon: {
        marginRight: 10,
    },
    dropdownText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    dropdownPlaceholder: {
        color: '#9CA3AF',
    },
    inputError: {
        borderColor: '#ff4d4f',
    },
    errorText: {
        color: '#ff4d4f',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
        textAlign: 'center',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    selectedOption: {
        backgroundColor: 'rgba(0, 210, 230, 0.1)',
    },
    optionText: {
        fontSize: 16,
        color: '#333333',
    },
    selectedOptionText: {
        color: '#00A3B4',
        fontWeight: '600',
    },
    closeButton: {
        marginTop: 16,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
    },
});