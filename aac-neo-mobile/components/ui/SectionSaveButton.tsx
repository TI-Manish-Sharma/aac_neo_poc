import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type SectionSaveButtonProps = {
    onPress: () => void;
    isCompleted: boolean;
    disabled?: boolean;
    isSaving?: boolean;
    title?: string;
};

export const SectionSaveButton: React.FC<SectionSaveButtonProps> = ({
    onPress,
    isCompleted,
    disabled = false,
    isSaving = false,
    title
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                isCompleted ? styles.completedButton : styles.incompleteButton,
                disabled && styles.disabledButton
            ]}
            onPress={onPress}
            disabled={disabled || isSaving}
        >
            {isSaving ? (
                <ActivityIndicator size="small" color="#fff" style={styles.icon} />
            ) : (
                <>
                    <FontAwesome
                        name={isCompleted ? "check-circle" : "save"}
                        size={16}
                        color="#fff"
                        style={styles.icon}
                    />
                    <Text style={styles.text}>
                        {title || (isCompleted ? 'Saved' : 'Save Section')}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    incompleteButton: {
        backgroundColor: '#00A3B4',
    },
    completedButton: {
        backgroundColor: '#4CAF50',
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
        opacity: 0.7,
    },
    text: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    icon: {
        marginRight: 8,
    },
});