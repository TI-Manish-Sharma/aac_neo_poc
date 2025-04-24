// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     Modal,
//     Platform,
//     ScrollView
// } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';

// interface TimePickerProps {
//     label: string;
//     value: string;
//     onChange: (value: string) => void;
//     error?: string;
//     required?: boolean;
//     icon?: string;
// }

// export function TimePicker({
//     label,
//     value,
//     onChange,
//     error,
//     required = false,
//     icon = 'clock-o'
// }: TimePickerProps) {
//     const parseValue = (v: string) => {
//         if (!v) return new Date();
//         const [time, period] = v.split(' ');
//         let [h, m] = time.split(':').map(Number);
//         if (period === 'PM' && h < 12) h += 12;
//         if (period === 'AM' && h === 12) h = 0;
//         const d = new Date();
//         d.setHours(h, m);
//         return d;
//     };

//     const [date, setDate] = useState<Date>(() => parseValue(value));
//     const [show, setShow] = useState(false);

//     useEffect(() => {
//         setDate(parseValue(value));
//     }, [value]);

//     const onChange24Hour = (event: any, selectedDate?: Date) => {
//         const currentDate = selectedDate || date;
//         setShow(Platform.OS === 'ios');
//         setDate(currentDate);

//         // Format time in 12-hour format with AM/PM
//         const hours = currentDate.getHours();
//         const minutes = currentDate.getMinutes();
//         const period = hours >= 12 ? 'PM' : 'AM';
//         const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
//         const formattedMinutes = minutes.toString().padStart(2, '0');

//         const timeString = `${formattedHours}:${formattedMinutes} ${period}`;
//         onChange(timeString);
//     };

//     const showTimepicker = () => {
//         setShow(true);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.label}>
//                 {label} {required && '*'}
//             </Text>
//             <TouchableOpacity
//                 style={[styles.inputContainer, error ? styles.errorInput : null]}
//                 onPress={showTimepicker}
//             >
//                 <FontAwesome name={icon as any} size={18} color="#00D2E6" style={styles.icon} />
//                 <Text style={[styles.valueText, !value ? styles.placeholderText : null]}>
//                     {value || "Select time"}
//                 </Text>
//                 <FontAwesome name="angle-down" size={18} color="#888" />
//             </TouchableOpacity>

//             {error && <Text style={styles.errorText}>{error}</Text>}

//             {show && (
//                 Platform.OS === 'ios' ? (
//                     <Modal
//                         transparent={true}
//                         animationType="slide"
//                         visible={show}
//                     >
//                         <TouchableOpacity
//                             style={styles.modalOverlay}
//                             activeOpacity={1}
//                             onPress={() => setShow(false)}
//                         >
//                             <View style={styles.modalContent}>
//                                 <View style={styles.modalHeader}>
//                                     <TouchableOpacity onPress={() => setShow(false)}>
//                                         <Text style={styles.modalCancel}>Cancel</Text>
//                                     </TouchableOpacity>
//                                     <Text style={styles.modalTitle}>Select Time</Text>
//                                     <TouchableOpacity onPress={() => setShow(false)}>
//                                         <Text style={styles.modalDone}>Done</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                                 <DateTimePicker
//                                     testID="timePicker"
//                                     themeVariant="light"
//                                     value={date}
//                                     mode="time"
//                                     is24Hour={false}
//                                     display="spinner"
//                                     positiveButton={{ label: 'OK', textColor: '#00D2E6' }}
//                                     negativeButton={{ label: 'Cancel', textColor: '#ff4d4f' }}
//                                     onChange={onChange24Hour}
//                                 />
//                             </View>
//                         </TouchableOpacity>
//                     </Modal>
//                 ) : (
//                     <DateTimePicker
//                         testID="timePicker"
//                         value={date}
//                         mode="time"
//                         is24Hour={false}
//                         display="default"
//                         onChange={onChange24Hour}
//                     />
//                 )
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: '600',
//         marginBottom: 8,
//         color: '#444',
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#E0E0E0',
//         borderRadius: 12,
//         backgroundColor: '#F8F9FA',
//         paddingVertical: 10,
//         paddingHorizontal: 12,
//         height: 50,
//     },
//     icon: {
//         marginRight: 10,
//     },
//     valueText: {
//         flex: 1,
//         fontSize: 16,
//         color: '#333',
//     },
//     placeholderText: {
//         color: '#9CA3AF',
//     },
//     errorInput: {
//         borderColor: '#ff4d4f',
//     },
//     errorText: {
//         color: '#ff4d4f',
//         fontSize: 12,
//         marginTop: 4,
//         marginLeft: 4,
//     },
//     modalOverlay: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(0,0,0,0.4)',
//     },
//     modalContent: {
//         backgroundColor: 'white',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingBottom: Platform.OS === 'ios' ? 40 : 20,
//     },
//     modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 16,
//         paddingHorizontal: 20,
//         borderBottomWidth: 1,
//         borderBottomColor: '#EFEFEF',
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//     },
//     modalCancel: {
//         fontSize: 16,
//         color: '#777',
//     },
//     modalDone: {
//         fontSize: 16,
//         color: '#00D2E6',
//         fontWeight: '600',
//     }
// });

// // components/ui/TimePicker.tsx
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { FontAwesome } from '@expo/vector-icons';
// import { ThemedText } from './ThemedText';
// import { formatTimeString } from '@/utils/time-utils';

// interface TimePickerProps {
//     label: string;
//     value: string;
//     onChange: (value: string) => void;
//     error?: string;
//     required?: boolean;
//     disabled?: boolean;
// }

// export const TimePicker: React.FC<TimePickerProps> = ({
//     label,
//     value,
//     onChange,
//     error,
//     required = false,
//     disabled = false
// }) => {
//     const [date, setDate] = useState(new Date());
//     const [show, setShow] = useState(false);

//     const onTimeChange = (event: any, selectedDate?: Date) => {
//         if (Platform.OS === 'android') {
//             setShow(false);
//         }
        
//         if (selectedDate) {
//             setDate(selectedDate);
//             const formattedTime = formatTimeString(selectedDate);
//             onChange(formattedTime);
//         }
//     };

//     const showTimepicker = () => {
//         if (disabled) return;
//         setShow(true);
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.labelContainer}>
//                 <ThemedText type="label" style={styles.label}>
//                     {label}
//                     {required && <Text style={styles.requiredAsterisk}>*</Text>}
//                 </ThemedText>
//             </View>
            
//             <TouchableOpacity 
//                 style={[
//                     styles.inputContainer, 
//                     error ? styles.inputContainerError : {},
//                     disabled ? styles.inputContainerDisabled : {}
//                 ]} 
//                 onPress={showTimepicker}
//                 disabled={disabled}
//             >
//                 <FontAwesome name="clock-o" size={18} color={disabled ? "#999" : "#00A3B4"} style={styles.icon} />
//                 <Text style={[styles.valueText, disabled ? styles.valueTextDisabled : {}]}>
//                     {value || 'Select time'}
//                 </Text>
//                 <FontAwesome name="chevron-down" size={12} color="#888" style={styles.chevron} />
//             </TouchableOpacity>
            
//             {error && (
//                 <Text style={styles.errorText}>{error}</Text>
//             )}
            
//             {show && (
//                 Platform.OS === 'ios' ? (
//                     <Modal
//                         animationType="slide"
//                         transparent={true}
//                         visible={show}
//                     >
//                         <View style={styles.modalContainer}>
//                             <View style={styles.modalContent}>
//                                 <View style={styles.modalHeader}>
//                                     <TouchableOpacity onPress={() => setShow(false)}>
//                                         <Text style={styles.modalCancelText}>Cancel</Text>
//                                     </TouchableOpacity>
//                                     <Text style={styles.modalTitle}>Select Time</Text>
//                                     <TouchableOpacity onPress={() => {
//                                         setShow(false);
//                                         onTimeChange(null, date);
//                                     }}>
//                                         <Text style={styles.modalDoneText}>Done</Text>
//                                     </TouchableOpacity>
//                                 </View>
                                
//                                 <DateTimePicker
//                                     value={date}
//                                     mode="time"
//                                     display="spinner"
//                                     onChange={onTimeChange}
//                                     minuteInterval={1}
//                                     style={styles.timePicker}
//                                 />
//                             </View>
//                         </View>
//                     </Modal>
//                 ) : (
//                     <DateTimePicker
//                         value={date}
//                         mode="time"
//                         is24Hour={false}
//                         display="default"
//                         onChange={onTimeChange}
//                         minuteInterval={1}
//                     />
//                 )
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         marginBottom: 10,
//     },
//     labelContainer: {
//         flexDirection: 'row',
//         marginBottom: 4,
//     },
//     label: {
//         fontSize: 15,
//         color: '#333',
//         fontWeight: '500',
//     },
//     requiredAsterisk: {
//         color: '#FF4545',
//         marginLeft: 2,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         height: 48,
//         borderWidth: 1,
//         borderColor: '#DEDEDE',
//         borderRadius: 8,
//         paddingHorizontal: 12,
//         backgroundColor: '#FFFFFF',
//     },
//     inputContainerError: {
//         borderColor: '#FF4545',
//     },
//     inputContainerDisabled: {
//         backgroundColor: '#F5F5F5',
//         borderColor: '#DDD',
//     },
//     icon: {
//         marginRight: 8,
//     },
//     valueText: {
//         flex: 1,
//         fontSize: 15,
//         color: '#333',
//     },
//     valueTextDisabled: {
//         color: '#999',
//     },
//     chevron: {
//         marginLeft: 8,
//     },
//     errorText: {
//         fontSize: 12,
//         color: '#FF4545',
//         marginTop: 4,
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         backgroundColor: '#FFFFFF',
//         borderTopLeftRadius: 16,
//         borderTopRightRadius: 16,
//         paddingBottom: 20,
//     },
//     modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#EFEFEF',
//     },
//     modalTitle: {
//         fontSize: 17,
//         fontWeight: '600',
//         color: '#333',
//     },
//     modalCancelText: {
//         fontSize: 16,
//         color: '#999',
//     },
//     modalDoneText: {
//         fontSize: 16,
//         color: '#00A3B4',
//         fontWeight: '600',
//     },
//     timePicker: {
//         height: 200,
//     },
// });

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';

type TimePickerProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    icon?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
};

export const TimePicker: React.FC<TimePickerProps> = ({
    label,
    value,
    onChange,
    icon = 'clock-o',
    required = false,
    disabled = false,
    error
}) => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onTimeChange = (_: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }
        
        if (selectedDate) {
            setDate(selectedDate);
            const formattedTime = formatTime(selectedDate);
            onChange(formattedTime);
        }
    };

    const formatTime = (date: Date): string => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        
        // Add leading zero to minutes if needed
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
        
        return `${hours}:${minutesStr} ${ampm}`;
    };

    const showTimepicker = () => {
        if (disabled) return;
        setShow(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
                {required && <Text style={styles.required}>*</Text>}
            </Text>

            <TouchableOpacity
                style={[
                    styles.input,
                    disabled && styles.disabledInput,
                    error && styles.errorInput
                ]}
                onPress={showTimepicker}
                disabled={disabled}
            >
                <FontAwesome
                    name={icon as "clock-o" | "filter" | "bold" | "medium" | "android" | "windows" | "key" | "sort" | "map" | "at" | "search" | "repeat" | "anchor" | "link" | "code" | "header" | "table" | "th" | "circle" | undefined}
                    size={18}
                    color={disabled ? "#999" : "#555"}
                    style={styles.icon}
                />
                <Text style={[styles.valueText, disabled && styles.disabledText]}>
                    {value || 'Select time'}
                </Text>
                {!disabled && (
                    <FontAwesome name="chevron-down" size={16} color="#888" style={styles.chevron} />
                )}
            </TouchableOpacity>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            {show && (
                Platform.OS === 'ios' ? (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={show}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <TouchableOpacity onPress={() => setShow(false)}>
                                        <Text style={styles.cancelButton}>Cancel</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.modalTitle}>Select Time</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShow(false);
                                            onTimeChange(null, date);
                                        }}
                                    >
                                        <Text style={styles.doneButton}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    value={date}
                                    mode="time"
                                    display="spinner"
                                    onChange={onTimeChange}
                                    style={styles.picker}
                                />
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={date}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={onTimeChange}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        marginBottom: 6,
        fontWeight: '500',
        color: '#444',
    },
    required: {
        color: '#E53935',
        marginLeft: 3,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
    },
    errorInput: {
        borderColor: '#E53935',
    },
    icon: {
        marginRight: 10,
    },
    valueText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    disabledText: {
        color: '#999',
    },
    chevron: {
        marginLeft: 5,
    },
    errorText: {
        color: '#E53935',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 2,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    cancelButton: {
        fontSize: 16,
        color: '#999',
    },
    doneButton: {
        fontSize: 16,
        color: '#2196F3',
        fontWeight: '600',
    },
    picker: {
        height: 200,
    },
});