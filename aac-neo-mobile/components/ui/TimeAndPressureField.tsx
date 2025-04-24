// import { AutoclaveFormData } from "@/types/autoclave.types";
// import React from "react";
// import { Control, useController, useWatch } from "react-hook-form";
// import { StyleSheet, View, Text } from "react-native";
// import { TimePicker } from "../TimePicker";
// import { FormInput } from "./FormInput";

// type TimeAndPressureProps = {
//     control: Control<AutoclaveFormData>,
//     nameTime: keyof AutoclaveFormData,
//     namePressure: keyof AutoclaveFormData,
//     nameDuration?: keyof AutoclaveFormData,
//     timeLabel: string,
//     pressureLabel: string,
//     required?: boolean
// };

// export const TimeAndPressureField = React.memo(({
//     control,
//     nameTime,
//     namePressure,
//     nameDuration,
//     timeLabel,
//     pressureLabel,
//     required = false
// }: TimeAndPressureProps) => {
//     const {
//         field: { onChange: onTimeChange, value: timeValue }
//     } = useController({ name: nameTime, control });

//     const {
//         field: { onChange: onPressureChange, onBlur: onPressureBlur, value: pressureValue }
//     } = useController({ name: namePressure, control });

//     const duration = nameDuration
//         ? useWatch({ name: nameDuration, control })
//         : undefined;

//     return (
//         <View>
//             <TimePicker
//                 label={timeLabel}
//                 required={required}
//                 icon="clock-o"
//                 value={Array.isArray(timeValue) ? timeValue.join(', ') : timeValue || ''}
//                 onChange={onTimeChange}
//             />
//             <FormInput
//                 label={pressureLabel}
//                 required={required}
//                 icon="dashboard"
//                 placeholder="Enter pressure"
//                 keyboardType="decimal-pad"
//                 onBlur={onPressureBlur}
//                 onChangeText={onPressureChange}
//                 value={String(pressureValue || '')}
//             />
//             {duration && duration !== '0h 0m' && (
//                 <View style={styles.calculatedFieldContainer}>
//                     <Text style={styles.calculatedFieldLabel}>Duration:</Text>
//                     <Text style={styles.calculatedTimeValue}>{duration}</Text>
//                 </View>
//             )}
//         </View>
//     );
// });

// const styles = StyleSheet.create({
//     calculatedFieldContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingLeft: 12 },
//     calculatedFieldLabel: { fontSize: 14, color: '#666', marginRight: 8 },
//     calculatedTimeValue: { fontSize: 16, fontWeight: '600', color: '#0066CC' },
// });

import { AutoclaveFormData } from "@/types/autoclave.types";
import React from "react";
import { Control, useController, useWatch } from "react-hook-form";
import { StyleSheet, View, Text } from "react-native";
import { TimePicker } from "../TimePicker";
import { FormInput } from "./FormInput";

type TimeAndPressureProps = {
    control: Control<AutoclaveFormData>,
    nameTime: keyof AutoclaveFormData,
    namePressure: keyof AutoclaveFormData,
    nameDuration?: keyof AutoclaveFormData,
    timeLabel: string,
    pressureLabel: string,
    required?: boolean,
    disabled?: boolean  // New prop to handle disabled state
};

export const TimeAndPressureField = React.memo(({
    control,
    nameTime,
    namePressure,
    nameDuration,
    timeLabel,
    pressureLabel,
    required = false,
    disabled = false  // Default is enabled
}: TimeAndPressureProps) => {
    const {
        field: { onChange: onTimeChange, value: timeValue },
        fieldState: { error: timeError }
    } = useController({ name: nameTime, control });

    const {
        field: { onChange: onPressureChange, onBlur: onPressureBlur, value: pressureValue },
        fieldState: { error: pressureError }
    } = useController({ name: namePressure, control });

    const duration = nameDuration
        ? useWatch({ name: nameDuration, control })
        : undefined;

    return (
        <View style={[styles.container, disabled && styles.disabledContainer]}>
            <TimePicker
                label={timeLabel}
                required={required}
                value={Array.isArray(timeValue) ? timeValue.join(', ') : timeValue || ''}
                onChange={onTimeChange}
                disabled={disabled}
                error={timeError?.message}
            />
            <FormInput
                label={pressureLabel}
                required={required}
                icon="dashboard"
                placeholder="Enter pressure"
                keyboardType="decimal-pad"
                onBlur={onPressureBlur}
                onChangeText={onPressureChange}
                value={String(pressureValue || '')}
                editable={!disabled}
                error={pressureError?.message}
            />
            {duration && duration !== '0h 0m' && (
                <View style={styles.calculatedFieldContainer}>
                    <Text style={styles.calculatedFieldLabel}>Duration:</Text>
                    <Text style={[
                        styles.calculatedTimeValue,
                        disabled && styles.disabledText
                    ]}>
                        {duration}
                    </Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginBottom: 16
    },
    disabledContainer: {
        opacity: 0.8
    },
    calculatedFieldContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 8, 
        paddingLeft: 12,
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 4
    },
    calculatedFieldLabel: { 
        fontSize: 14, 
        color: '#666', 
        marginRight: 8,
        fontWeight: '500'
    },
    calculatedTimeValue: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#0066CC' 
    },
    disabledText: {
        color: '#888'
    }
});