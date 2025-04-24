import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type Option = {
    id: string;
    label: string;
    subtitle?: string;
};

type MultiSelectDropdownProps = {
    label: string;
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    required?: boolean;
    error?: string;
    icon?: React.ComponentProps<typeof FontAwesome>['name'];
    placeholder?: string;
    renderItem?: (item: Option, isSelected: boolean, onToggle: () => void) => React.ReactNode;
    disabled?: boolean;
};

export const MultiSelectDropdown = ({
    label,
    options,
    selectedValues,
    onChange,
    required = false,
    error,
    icon = "list-ul",
    placeholder = "Select items",
    renderItem
}: MultiSelectDropdownProps) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedItems = options.filter(option => selectedValues.includes(option.id));

    const toggleItem = (itemId: string) => {
        const newSelection = selectedValues.includes(itemId)
            ? selectedValues.filter(id => id !== itemId)
            : [...selectedValues, itemId];

        onChange(newSelection);
    };

    const defaultRenderItem = (item: Option, isSelected: boolean, onToggle: () => void) => (
        <TouchableOpacity
            style={[styles.item, isSelected && styles.selectedItem]}
            onPress={onToggle}
        >
            <View style={styles.itemContent}>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemText}>{item.label}</Text>
                    {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
                </View>
                {isSelected && <FontAwesome name="check" size={16} color="#00D2E6" />}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label} {required && <Text style={styles.required}>*</Text>}
            </Text>

            <TouchableOpacity
                style={[styles.dropdownWrapper, error && styles.inputError]}
                onPress={() => setModalVisible(true)}
            >
                <FontAwesome name={icon} size={18} color="#00D2E6" style={styles.inputIcon} />
                <Text style={[styles.dropdownText, selectedItems.length === 0 && styles.dropdownPlaceholder]}>
                    {selectedItems.length > 0
                        ? `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} selected`
                        : placeholder}
                </Text>
                <FontAwesome name="chevron-down" size={16} color="#888" />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* {selectedItems.length > 0 && (
                <ScrollView style={styles.selectedItemsContainer}>
                    {selectedItems.map(item => (
                        <View key={item.id} style={styles.selectedItemChip}>
                            <Text style={styles.selectedItemText} numberOfLines={1}>
                                {item.label}
                            </Text>
                            <TouchableOpacity
                                onPress={() => toggleItem(item.id)}
                                style={styles.removeItemButton}
                            >
                                <FontAwesome name="times" size={14} color="#666" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )} */}

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                    activeOpacity={1}
                >
                    <View
                        style={styles.modalContent}
                        // This prevents touch events from bubbling up to the overlay
                        onStartShouldSetResponder={() => true}
                    >
                        <Text style={styles.modalTitle}>Select {label}</Text>

                        {options.length > 0 ? (
                            <FlatList
                                data={options}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => {
                                    const isSelected = selectedValues.includes(item.id);
                                    // return renderItem ?
                                    //     renderItem(item, isSelected, () => toggleItem(item.id)) :
                                    //     defaultRenderItem(item, isSelected, () => toggleItem(item.id));
                                    if (renderItem) {
                                        return React.createElement(() => renderItem(item, isSelected, () => toggleItem(item.id)));
                                    }
                                    return defaultRenderItem(item, isSelected, () => toggleItem(item.id));
                                }}
                                style={styles.optionsList}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <FontAwesome name="info-circle" size={40} color="#ccc" />
                                <Text style={styles.emptyText}>No options available</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.doneButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#444' },
    required: { color: '#ff4d4f' },
    dropdownWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        paddingVertical: 10,
        paddingHorizontal: 12,
        height: 50
    },
    inputIcon: { marginRight: 10 },
    dropdownText: { flex: 1, fontSize: 16, color: '#333' },
    dropdownPlaceholder: { color: '#9CA3AF' },
    inputError: { borderColor: '#ff4d4f' },
    errorText: { color: '#ff4d4f', fontSize: 12, marginTop: 4, marginLeft: 4 },

    selectedItemsContainer: {
        maxHeight: 120,
        marginTop: 8
    },
    selectedItemChip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,210,230,0.1)',
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
        maxWidth: '100%'
    },
    selectedItemText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        marginRight: 8
    },
    removeItemButton: {
        padding: 4,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        maxHeight: '80%'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center'
    },
    optionsList: {
        maxHeight: 300
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    selectedItem: {
        backgroundColor: 'rgba(0,210,230,0.1)'
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemTextContainer: {
        flex: 1
    },
    itemText: {
        fontSize: 16,
        color: '#333'
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    },
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 16
    },
    doneButton: {
        marginTop: 16,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#00D2E6',
        borderRadius: 8
    },
    doneButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF'
    }
});