import { BatchStageStatus } from "@/context/BatchContext";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

// Status indicator component
export const StatusIndicator: React.FC<{ status: BatchStageStatus; label: string; onPress?: () => void }> = ({ status, label, onPress }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return '#2E8B57'; // Dark green
            case 'in-progress':
                return '#FFD700'; // Yellow
            case 'pending':
                return '#D3D3D3'; // Light gray
            default:
                return '#D3D3D3';
        }
    };

    return (
        <TouchableOpacity
            style={styles.statusItem}
            disabled={!onPress}
            onPress={onPress}
        >
            <View
                style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor() }
                ]}
            />
            <ThemedText style={styles.statusLabel}>{label}</ThemedText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    statusItem: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        marginRight: 8,
    },
    statusLabel: {
        fontSize: 14,
    },
});
