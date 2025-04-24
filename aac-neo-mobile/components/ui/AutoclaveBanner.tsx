import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AutoclaveBannerProps {
    /** Autoclave identifier, e.g. "1", "2" */
    autoclaveNumber: string | number;
    /** Optional shift label, e.g. "Morning", "Night" */
    shift?: string;
    /** Additional styling for container (e.g. animated style) */
    style?: StyleProp<ViewStyle>;
}

/**
 * A banner displaying the autoclave number and, if provided, the shift.
 * Supports gradient background and optional external styling.
 */
const AutoclaveBanner: React.FC<AutoclaveBannerProps> = ({ autoclaveNumber, shift, style }) => (
    <LinearGradient
        colors={['#00D2E6', '#0088cc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, style]}
    >
        <View style={styles.item}>
            <Text style={styles.label}>Autoclave #</Text>
            <Text style={styles.value}>{autoclaveNumber}</Text>
        </View>
        {shift ? (
            <View style={styles.item}>
                <Text style={styles.label}>Shift</Text>
                <Text style={styles.value}>{shift}</Text>
            </View>
        ) : null}
    </LinearGradient>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    item: {
        flex: 1
    },
    label: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500'
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 3
    }
});

export default AutoclaveBanner;
