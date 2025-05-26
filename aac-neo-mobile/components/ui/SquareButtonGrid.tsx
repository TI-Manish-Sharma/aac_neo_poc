// components/ui/SquareButtonGrid.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { SquareButton, IconFamily } from './SquareButton';

const { width } = Dimensions.get('window');

interface GridButtonOption {
    screen: string;
    title: string;
    iconFamily: IconFamily;
    iconName: string;
    isPressed?: boolean;
    fadeAnim?: any;
    scaleAnim?: any;
    isEmpty?: boolean;
}

interface SquareButtonGridProps {
    options: GridButtonOption[];
    onPress: (screen: string) => void;
    onPressIn?: (screen: string) => void;
    onPressOut?: () => void;
    containerStyle?: ViewStyle;
    gridStyle?: ViewStyle;
    columns?: number; // New prop for number of columns
    buttonWidth?: `${number}%`; // Made optional, will be calculated from columns if provided
    alignment?: 'space-between' | 'flex-start' | 'center' | 'flex-end' | 'space-around' | 'space-evenly';
    autoFillPlaceholders?: boolean; // New prop to enable auto-filling placeholders
}

export const SquareButtonGrid: React.FC<SquareButtonGridProps> = ({
    options,
    onPress,
    onPressIn,
    onPressOut,
    containerStyle,
    gridStyle,
    columns = 2, // Default to 2 columns
    buttonWidth, // No default, will be calculated
    alignment = 'space-between', // default alignment
    autoFillPlaceholders = true, // Enable by default
}) => {
    // Calculate buttonWidth based on columns if not explicitly provided
    const calculatedButtonWidth = buttonWidth || `${Math.floor((100 - ((columns - 1) * 2)) / columns)}%`;
    
    // Get the column count (either from columns prop or calculated from buttonWidth)
    const getColumnCount = (): number => {
        if (columns) return columns;
        
        // Fallback to calculating from buttonWidth if somehow both are provided
        const widthPercent = parseInt(calculatedButtonWidth.replace('%', ''));
        return Math.floor(100 / widthPercent);
    };

    // Calculate how many placeholders to add to complete the last row
    const calculatePlaceholders = (): GridButtonOption[] => {
        if (!autoFillPlaceholders) return [];

        const columnCount = getColumnCount();
        const itemCount = options.length;
        const remainder = itemCount % columnCount;

        // If items perfectly fill rows, don't add placeholders
        if (remainder === 0) return [];

        // Calculate how many placeholders needed to complete the row
        const placeholdersNeeded = columnCount - remainder;

        // Create array of empty placeholder items
        return Array(placeholdersNeeded).fill(null).map((_, index) => ({
            screen: `EmptyPlaceholder_${index}`,
            title: '',
            iconFamily: 'FontAwesome' as IconFamily,
            iconName: '',
            isEmpty: true
        }));
    };

    // Combine original options with placeholders
    const displayOptions = [...options, ...calculatePlaceholders()];
    
    return (
        <View style={[styles.menuContainer, containerStyle]}>
            <View style={[
                styles.menuGrid,
                { justifyContent: alignment },
                gridStyle
            ]}>
                {displayOptions.map((option, index) => (
                    <SquareButton
                        key={option.screen || `empty-${index}`}
                        screen={option.screen}
                        title={option.title}
                        iconFamily={option.iconFamily}
                        icon={option.iconName}
                        isPressed={option.isPressed}
                        fadeAnim={option.fadeAnim}
                        scaleAnim={option.scaleAnim}
                        onPress={onPress}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        wrapperWidth={calculatedButtonWidth}
                        isEmpty={option.isEmpty}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        flex: 1,
        paddingHorizontal: width * 0.04,
        paddingTop: 10,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
});