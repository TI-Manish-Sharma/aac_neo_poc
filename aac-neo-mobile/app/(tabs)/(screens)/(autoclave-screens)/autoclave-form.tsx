// ---------------------------------------------------------------- Untabbed Version (One submit button)
import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Alert,
    Keyboard,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormInput } from '@/components/ui/FormInput';
import { autoclaveFormSchema } from '@/schema/autoclave.schema';
import { AutoclaveFormData } from '@/types/autoclave.types';
import { ScreenFooter } from '@/components/ui/ScreenFooter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ActionButtons } from '@/components/ui/ActionButtons';
import { useAnimations } from '@/hooks/useAnimations';
import { FormContainer, useKeyboardVisibility } from '@/components/ui/FormContainer';
import { useBatch } from '@/context/BatchContext';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { TimeAndPressureField } from '@/components/ui/TimeAndPressureField';
import AutoclaveBanner from '@/components/ui/AutoclaveBanner';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';

const { width } = Dimensions.get('window');
const shiftOptions = ['Morning', 'Afternoon', 'Night'];

// -- Main Screen Component ----------------------------------
export default function AutoclaveFormScreen() {
    const params = useLocalSearchParams();
    const keyboardVisible = useKeyboardVisibility();
    const [showBatchesModal, setShowBatchesModal] = useState(false);

    const {
        getBatchById,
        getBatchesByStage,
        batches,
        setBatches,
        updateBatchStage,
        addAutoclave
    } = useBatch();

    const autoclaveNumber = (params.autoclaveNumber as string) || '1';
    const [selectedBatches, setSelectedBatches] = useState<
        Array<{ id: string; batchNumber: string; mouldNumber: string }>
    >([]);
    const [availableBatches, setAvailableBatches] = useState<
        Array<{ id: string; batchNumber: string; mouldNumber: string }>
    >([]);

    const { control, handleSubmit, formState: { errors }, setValue, watch } =
        useForm<AutoclaveFormData>({
            resolver: zodResolver(autoclaveFormSchema),
            defaultValues: {
                autoclaveNumber,
                shift: '',
                batchesProcessed: [],
                previousDoorOpenTime: '',
                previousDoorOpenPressure: '',
                doorCloseTime: '',
                doorClosePressure: '',
                vacuumFinishTime: '',
                vacuumFinishPressure: '',
                slowSteamStartTime: '',
                slowSteamStartPressure: '',
                fastSteamStartTime: '',
                fastSteamStartPressure: '',
                maxPressureTime: '',
                maxPressure: '',
                releaseStartTime: '',
                releaseStartPressure: '',
                doorOpenTime: '',
                doorOpenPressure: '',
                doorCloseDuration: '0h 0m',
                vacuumFinishDuration: '0h 0m',
                slowSteamDuration: '0h 0m',
                fastSteamDuration: '0h 0m',
                maxPressureDuration: '0h 0m',
                releaseStartDuration: '0h 0m',
                doorOpenDuration: '0h 0m'
            }
        });

    const { fadeAnim, scaleAnim, headerAnim, bannerAnim } = useAnimations();

    // watch only shift (banner) and times for duration calc
    const shift = watch('shift');
    const timeFields = useMemo(() => [
        'previousDoorOpenTime',
        'doorCloseTime',
        'vacuumFinishTime',
        'slowSteamStartTime',
        'fastSteamStartTime',
        'maxPressureTime',
        'releaseStartTime',
        'doorOpenTime'
    ] as (keyof AutoclaveFormData)[], []);

    // load available batches
    useEffect(() => {
        try {
            const autoclaveBatches = getBatchesByStage('autoclave', 'in-progress').filter(b =>
                b.processSteps?.cutting?.cuttingTime !== ""
            );
            const mapped = autoclaveBatches.map(b => ({
                id: b.batchId,
                batchNumber: b.batchId,
                mouldNumber: b.mouldId
            }));
            setAvailableBatches(mapped);
        } catch (e) {
            console.error(e);
        }
    }, [getBatchesByStage]);

    const prevDoorOpenTime = useWatch({ control, name: 'previousDoorOpenTime' });
    const doorCloseTime = useWatch({ control, name: 'doorCloseTime' });
    const vacuumFinishTime = useWatch({ control, name: 'vacuumFinishTime' });
    const slowSteamStartTime = useWatch({ control, name: 'slowSteamStartTime' });
    const fastSteamStartTime = useWatch({ control, name: 'fastSteamStartTime' });
    const maxPressureTime = useWatch({ control, name: 'maxPressureTime' });
    const releaseStartTime = useWatch({ control, name: 'releaseStartTime' });
    const doorOpenTime = useWatch({ control, name: 'doorOpenTime' });

    const calculateTimeDifference = (start?: string, end?: string) => {
        if (!start || !end) return '0h 0m';
        const toMinutes = (t: string) => {
            const [hm, mer] = t.split(' ');
            let [h, m] = hm.split(':').map(Number);
            if (mer === 'PM' && h < 12) h += 12;
            if (mer === 'AM' && h === 12) h = 0;
            return h * 60 + m;
        };
        let diff = toMinutes(end) - toMinutes(start);
        if (diff < 0) diff += 24 * 60;
        return `${Math.floor(diff / 60)}h ${diff % 60}m`;
    };

    useEffect(() => {
        setValue('doorCloseDuration', calculateTimeDifference(prevDoorOpenTime, doorCloseTime));
        setValue('vacuumFinishDuration', calculateTimeDifference(doorCloseTime, vacuumFinishTime));
        setValue('slowSteamDuration', calculateTimeDifference(vacuumFinishTime, slowSteamStartTime));
        setValue('fastSteamDuration', calculateTimeDifference(slowSteamStartTime, fastSteamStartTime));
        setValue('maxPressureDuration', calculateTimeDifference(fastSteamStartTime, maxPressureTime));
        setValue('releaseStartDuration', calculateTimeDifference(maxPressureTime, releaseStartTime));
        setValue('doorOpenDuration', calculateTimeDifference(releaseStartTime, doorOpenTime));
    }, [
        prevDoorOpenTime,
        doorCloseTime,
        vacuumFinishTime,
        slowSteamStartTime,
        fastSteamStartTime,
        maxPressureTime,
        releaseStartTime,
        doorOpenTime,
        setValue
    ]);

    const toggleBatch = (batch: { id: string; batchNumber: string; mouldNumber: string }) => {
        const exists = selectedBatches.find(b => b.id === batch.id);
        const updated = exists
            ? selectedBatches.filter(b => b.id !== batch.id)
            : [...selectedBatches, batch];
        setSelectedBatches(updated);
        setValue('batchesProcessed', updated.map(b => b.id), { shouldValidate: true });
    };

    const onSubmit = (data: AutoclaveFormData) => {

        Keyboard.dismiss();
        if (!data.batchesProcessed.length) {
            return Alert.alert('Missing Information', 'Please select at least one batch to process');
        }
        try {
            // Create the autoclave record first
            const autoclaveRecord = {
                _id: `autoclave_${data.autoclaveNumber}_${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
                autoclaveId: parseInt(data.autoclaveNumber, 10),
                shift: data.shift,
                batchesProcessed: data.batchesProcessed.join(', '),
                previousDoorOpenTime: data.previousDoorOpenTime,
                previousDoorOpenPressure: parseFloat(data.previousDoorOpenPressure) || 0,
                doorCloseTime: data.doorCloseTime,
                doorClosePressure: parseFloat(data.doorClosePressure) || 0,
                vacuumFinishTime: data.vacuumFinishTime || '',
                vacuumFinishPressure: parseFloat(data.vacuumFinishPressure || '0') || 0,
                slowSteamStartTime: data.slowSteamStartTime || '',
                slowSteamStartPressure: parseFloat(data.slowSteamStartPressure || '0') || 0,
                fastSteamStartTime: data.fastSteamStartTime || '',
                fastSteamStartPressure: parseFloat(data.fastSteamStartPressure || '0') || 0,
                maxPressureTime: data.maxPressureTime || '',
                maxPressure: parseFloat(data.maxPressure || '0') || 0,
                releaseStartTime: data.releaseStartTime || '',
                releaseStartPressure: parseFloat(data.releaseStartPressure || '0') || 0,
                doorOpenTime: data.doorOpenTime || '',
                doorOpenPressure: parseFloat(data.doorOpenPressure) || 0,
                doorCloseDuration: data.doorCloseDuration || '',
                vacuumFinishDuration: data.vacuumFinishDuration || '',
                slowSteamDuration: data.slowSteamDuration || '',
                fastSteamDuration: data.fastSteamDuration || '',
                maxPressureDuration: data.maxPressureDuration || '',
                releaseStartDuration: data.releaseStartDuration || '',
                doorOpenDuration: data.doorOpenDuration || ''
            };

            // Add the autoclave record to context
            addAutoclave(autoclaveRecord);

            // Update each batch with basic autoclave reference data
            const updatedBatches = batches.map(batch => {
                // Only update the selected batches
                if (!data.batchesProcessed.includes(batch.batchId)) {
                    return batch;
                }

                return {
                    ...batch,
                    processSteps: {
                        ...batch.processSteps,
                        autoclave: {
                            autoclaveNumber: data.autoclaveNumber.toString(),
                            shift: data.shift,
                            processedAt: new Date().toISOString(),
                            doorOpenTime: data.doorOpenTime
                        }
                    },
                    metadata: {
                        ...batch.metadata,
                        updatedAt: new Date().toISOString()
                    }
                };
            });

            // Update the batches in context
            setBatches(updatedBatches);

            // Update batch stages
            data.batchesProcessed.forEach(id => {
                updateBatchStage(id, 'autoclave', 'completed');
                updateBatchStage(id, 'segregation', 'in-progress');
            });

            Alert.alert(
                'Success',
                `Autoclave ${data.autoclaveNumber} data recorded!`,
                [{ text: 'OK', onPress: () => router.navigate('/(tabs)/(screens)/(autoclave-screens)/autoclave') }]
            );
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'There was a problem saving the data. Please try again.');
        }
    };

    return (
        <ThemedView style={styles.container}>
            {!keyboardVisible && (
                <ScreenHeader
                    title="Autoclave Form"
                    subtitle={`Autoclave #${autoclaveNumber}`}
                    icon="thermometer-full"
                    headerAnim={headerAnim}
                    onBack={() => router.back()}
                />
            )}

            <AutoclaveBanner
                autoclaveNumber={autoclaveNumber}
                shift={shift} />

            <FormContainer fadeAnim={fadeAnim} scaleAnim={scaleAnim}>
                <ThemedText type="subtitle" style={styles.formSectionTitle}>
                    General Information
                </ThemedText>

                <View style={styles.formSection}>
                    {/* Autoclave Number */}
                    <Controller
                        control={control}
                        name="autoclaveNumber"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <FormInput
                                label="Autoclave Number"
                                required
                                icon="hashtag"
                                placeholder="Enter autoclave number"
                                keyboardType="numeric"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={String(value)}
                                error={errors.autoclaveNumber?.message}
                            />
                        )}
                    />

                    {/* Shift */}
                    <Controller
                        control={control}
                        name="shift"
                        render={({ field: { value } }) => (
                            <CustomDropdown
                                label="Shift"
                                required
                                icon="clock-o"
                                value={value}
                                options={shiftOptions}
                                error={errors.shift?.message}
                                onSelect={opt => setValue('shift', opt, { shouldValidate: true })}
                            />
                        )}
                    />

                    {/* Batches Processed */}
                    <Controller
                        control={control}
                        name="batchesProcessed"
                        render={({ field: { value, onChange } }) => (
                            <MultiSelectDropdown
                                label="Batches Processed"
                                options={availableBatches.map(b => ({
                                    id: b.id,
                                    label: `Batch #${b.batchNumber}`,
                                    subtitle: `Mould #${b.mouldNumber}`
                                }))}
                                selectedValues={value}
                                onChange={onChange}
                                required
                                error={errors.batchesProcessed?.message}
                                placeholder="Select batches"
                            />
                        )}
                    />
                </View>

                <ThemedText type="subtitle" style={styles.formSectionTitle}>
                    Time and Pressure Readings
                </ThemedText>

                <View style={styles.timeEntryContainer}>
                    <Text style={styles.timeEntryHeader}>Previous Door Open</Text>
                    <TimeAndPressureField
                        control={control}
                        nameTime="previousDoorOpenTime"
                        namePressure="previousDoorOpenPressure"
                        timeLabel="Time (Clock Time)"
                        pressureLabel="Pressure"
                        required
                    />
                </View>

                <View style={styles.timeEntryContainer}>
                    <Text style={styles.timeEntryHeader}>Door Close</Text>
                    <TimeAndPressureField
                        control={control}
                        nameTime="doorCloseTime"
                        namePressure="doorClosePressure"
                        nameDuration="doorCloseDuration"
                        timeLabel="Time (Clock Time)"
                        pressureLabel="Pressure"
                        required
                    />
                </View>

                <View style={styles.timeEntryContainer}>
                    <Text style={styles.timeEntryHeader}>Vacuum Finish</Text>
                    <TimeAndPressureField
                        control={control}
                        nameTime="vacuumFinishTime"
                        namePressure="vacuumFinishPressure"
                        nameDuration="vacuumFinishDuration"
                        timeLabel="Time (Clock Time)"
                        pressureLabel="Pressure"
                    />
                </View>

                <View style={styles.timeEntryContainer}>
                    <Text style={styles.timeEntryHeader}>Slow Steam Start</Text>
                    <TimeAndPressureField
                        control={control}
                        nameTime="slowSteamStartTime"
                        namePressure="slowSteamStartPressure"
                        nameDuration="slowSteamDuration"
                        timeLabel="Time (Clock Time)"
                        pressureLabel="Pressure"
                    />
                </View>

                <View style={styles.timeEntryContainer}>
                    <Text style={styles.timeEntryHeader}>Fast Steam Start</Text>
                    <TimeAndPressureField
                        control={control}
                        nameTime="fastSteamStartTime"
                        namePressure="fastSteamStartPressure"
                        nameDuration="fastSteamDuration"
                        timeLabel="Time (Clock Time)"
                        pressureLabel="Pressure"
                    />
                </View>

                <View style={styles.timeEntryContainer}>
                    <Text style={styles.timeEntryHeader}>Max Pressure</Text>
                    <TimeAndPressureField
                        control={control}
                        nameTime="maxPressureTime"
                        namePressure="maxPressure"
                        nameDuration="maxPressureDuration"
                        timeLabel="Time (Clock Time)"
                        pressureLabel="Pressure"
                    />
                </View>

                <View style={styles.timeEntryContainer}>
                    <Text style={styles.timeEntryHeader}>Release Start</Text>
                    <TimeAndPressureField
                        control={control}
                        nameTime="releaseStartTime"
                        namePressure="releaseStartPressure"
                        nameDuration="releaseStartDuration"
                        timeLabel="Time (Clock Time)"
                        pressureLabel="Pressure"
                    />
                </View>

                <View style={styles.timeEntryContainer}>
                    <Text style={styles.timeEntryHeader}>Door Open</Text>
                    <TimeAndPressureField
                        control={control}
                        nameTime="doorOpenTime"
                        namePressure="doorOpenPressure"
                        nameDuration="doorOpenDuration"
                        timeLabel="Time (Clock Time)"
                        pressureLabel="Pressure"
                    />
                </View>

                <ActionButtons onSubmit={handleSubmit(onSubmit)} onCancel={() => router.back()} fadeAnim={fadeAnim} />
            </FormContainer>

            {!keyboardVisible && (
                <ScreenFooter
                    text="Record autoclave details for precise batch tracking"
                    fadeAnim={fadeAnim}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 0 },
    formSectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20, color: '#00A3B4' },
    formSection: { marginBottom: 20 },
    timeEntryContainer: { marginBottom: 24, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 16 },
    timeEntryHeader: {
        fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12,
        paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
    },
});

// --------------------------------------------------------------------- Tabbed Version
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     ActivityIndicator
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FontAwesome } from '@expo/vector-icons';
// import { router, useLocalSearchParams } from 'expo-router';
// import { useForm, useController, useWatch } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';

// import { ThemedView } from '@/components/ThemedView';
// import { FormInput } from '@/components/ui/FormInput';
// import { autoclaveFormSchema } from '@/schema/autoclave.schema';
// import { ScreenHeader } from '@/components/ui/ScreenHeader';
// import { useAnimations } from '@/hooks/useAnimations';
// import { FormContainer, useKeyboardVisibility } from '@/components/ui/FormContainer';
// import { useBatch } from '@/context/BatchContext';
// import { CustomDropdown } from '@/components/ui/CustomDropdown';
// import { TimeAndPressureField } from '@/components/ui/TimeAndPressureField';
// import AutoclaveBanner from '@/components/ui/AutoclaveBanner';
// import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';

// // Define the stages in the autoclave process
// const AUTOCLAVE_STAGES = [
//     { key: 'basicInfo', label: 'Basic Info', required: true },
//     { key: 'doorClose', label: 'Door Close', required: true },
//     { key: 'vacuumFinish', label: 'Vacuum', required: true },
//     { key: 'slowSteam', label: 'Slow Steam', required: true }, 
//     { key: 'fastSteam', label: 'Fast Steam', required: true },
//     { key: 'maxPressure', label: 'Max Pressure', required: true },
//     { key: 'releaseStart', label: 'Release', required: true },
//     { key: 'doorOpen', label: 'Door Open', required: true }
// ];

// const shiftOptions = ['Morning', 'Afternoon', 'Night'];

// export default function AutoclaveFormScreen() {
//     const params = useLocalSearchParams();
//     const keyboardVisible = useKeyboardVisibility();
//     const [showBatchesModal, setShowBatchesModal] = useState(false);
//     const [activeTab, setActiveTab] = useState(0);
//     const [stageCompleted, setStageCompleted] = useState({});
//     const [formInitialized, setFormInitialized] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);

//     const {
//         getBatchById,
//         batches,
//         setBatches,
//         autoclaves,
//         addAutoclave,
//         setAutoclaves,
//         updateBatchStage
//     } = useBatch();

//     const autoclaveNumber = Array.isArray(params.autoclaveNumber) 
//     ? params.autoclaveNumber[0] // Take the first item if it's an array
//     : params.autoclaveNumber || '1'; // Default to '1' if undefined
//     const existingAutoclaveId = parseInt(autoclaveNumber, 10);

//     // Check for existing autoclave data
//     const existingAutoclave = autoclaves.find(a => a.autoclaveId === existingAutoclaveId);

//     const [selectedBatches, setSelectedBatches] = useState([]);
//     const [availableBatches, setAvailableBatches] = useState([]);

//     const { control, handleSubmit, formState: { errors }, setValue, watch, getValues, reset } =
//         useForm({
//             resolver: zodResolver(autoclaveFormSchema),
//             defaultValues: {
//                 autoclaveNumber,
//                 shift: '',
//                 batchesProcessed: [],
//                 previousDoorOpenTime: '',
//                 previousDoorOpenPressure: '',
//                 doorCloseTime: '',
//                 doorClosePressure: '',
//                 vacuumFinishTime: '',
//                 vacuumFinishPressure: '',
//                 // ... other form fields
//                 doorOpenDuration: '0h 0m'
//             }
//         });

//     const { fadeAnim, scaleAnim, headerAnim, bannerAnim } = useAnimations();

//     // Storage key for this specific autoclave's form progress
//     const getStorageKey = () => `autoclave_form_progress_${autoclaveNumber}`;

//     // Load available batches from context
//     useEffect(() => {
//         try {
//             // Get batches that have completed cutting but not autoclave
//             const cuttingDone = batches
//                 .filter(b => b.processSteps.cutting.cuttingTime?.trim().length > 0)
//                 .map(b => ({
//                     id: b.batchId,
//                     batchNumber: b.batchId,
//                     mouldNumber: b.mouldId
//                 }));

//             setAvailableBatches(cuttingDone);
//         } catch (e) {
//             console.error('Error filtering cutting-completed batches:', e);
//         }
//     }, [batches]);

//     // Load saved form data from storage
//     const loadSavedFormData = async () => {
//         try {
//             setIsLoading(true);

//             // First priority: existing autoclave record
//             if (existingAutoclave) {
//                 console.log('Loading existing autoclave data:', existingAutoclave);
                
//                 // Load values from existing autoclave
//                 Object.entries(existingAutoclave).forEach(([key, value]) => {
//                     if (value !== undefined && key !== '_id' && key !== 'autoclaveId') {
//                         // Handle batch IDs
//                         if (key === 'batchesProcessed' && typeof value === 'string') {
//                             setValue('batchesProcessed', value.split(',').map(id => id.trim()));
//                         } else if (typeof value === 'number') {
//                             setValue(key, value.toString());
//                         } else {
//                             setValue(key, value);
//                         }
//                     }
//                 });

//                 // Set selected batches
//                 if (existingAutoclave.batchesProcessed) {
//                     const batchIds = existingAutoclave.batchesProcessed.split(',').map(id => id.trim());
//                     const batchData = batchIds.map(id => {
//                         const batch = getBatchById(id);
//                         return batch ? {
//                             id: batch.batchId,
//                             batchNumber: batch.batchId,
//                             mouldNumber: batch.mouldId
//                         } : null;
//                     }).filter(Boolean);

//                     setSelectedBatches(batchData);
//                 }

//                 // Determine which stages are complete
//                 updateStageCompletionStatus(existingAutoclave);
//             } else {
//                 // Second priority: locally saved form progress
//                 const savedFormJson = await AsyncStorage.getItem(getStorageKey());
//                 if (savedFormJson) {
//                     console.log('Loading saved form progress');
//                     const savedForm = JSON.parse(savedFormJson);

//                     // Load form values
//                     Object.entries(savedForm.formData).forEach(([key, value]) => {
//                         if (value !== undefined) {
//                             setValue(key, value);
//                         }
//                     });

//                     // Load selected batches
//                     setSelectedBatches(savedForm.selectedBatches || []);

//                     // Load completion status
//                     setStageCompleted(savedForm.stageCompleted || {});
//                 }
//             }

//             setFormInitialized(true);
//             setIsLoading(false);
//         } catch (error) {
//             console.error('Error loading saved form data:', error);
//             setIsLoading(false);
//         }
//     };

//     // Save progress to local storage
//     const saveProgress = async (formData) => {
//         try {
//             const dataToSave = formData || getValues();
//             const saveData = {
//                 formData: dataToSave,
//                 selectedBatches,
//                 stageCompleted
//             };

//             await AsyncStorage.setItem(getStorageKey(), JSON.stringify(saveData));
//             console.log('Progress saved for autoclave', autoclaveNumber);
//             return true;
//         } catch (error) {
//             console.error('Error saving progress:', error);
//             return false;
//         }
//     };

//     // Update completion status based on loaded data
//     const updateStageCompletionStatus = (formData) => {
//         const newStageCompleted = {};

//         // Basic Info
//         newStageCompleted.basicInfo = Boolean(
//             formData.autoclaveNumber &&
//             formData.shift &&
//             (formData.batchesProcessed && 
//                 (Array.isArray(formData.batchesProcessed) 
//                     ? formData.batchesProcessed.length > 0 
//                     : formData.batchesProcessed.trim() !== '')) &&
//             formData.previousDoorOpenTime &&
//             formData.previousDoorOpenPressure
//         );

//         // Door Close
//         newStageCompleted.doorClose = Boolean(
//             formData.doorCloseTime &&
//             formData.doorClosePressure
//         );

//         // Other stages follow the same pattern
//         // ...

//         // Door Open (final stage)
//         newStageCompleted.doorOpen = Boolean(
//             formData.doorOpenTime &&
//             formData.doorOpenPressure
//         );

//         setStageCompleted(newStageCompleted);
//     };

//     // Load saved data when component mounts
//     useEffect(() => {
//         loadSavedFormData();
//     }, [autoclaveNumber]);

//     // Handle stage completion updates
//     const handleStageCompletion = useCallback((stageKey, isComplete) => {
//         setStageCompleted(prev => {
//             if (prev[stageKey] === isComplete) return prev;
//             return { ...prev, [stageKey]: isComplete };
//         });
        
//         // Auto-save when stage completion changes
//         saveProgress();
//     }, []);

//     // Navigation helper functions
//     const canMoveToNextStage = () => {
//         const currentStage = AUTOCLAVE_STAGES[activeTab];
//         return stageCompleted[currentStage.key] || !currentStage.required;
//     };

//     // Handle saving the current stage data
//     const saveCurrentStage = async () => {
//         try {
//             // Get current form values
//             const formData = getValues();
            
//             // Create or update the autoclave record
//             let autoclaveRecord = existingAutoclave ? {...existingAutoclave} : {
//                 _id: `autoclave_${formData.autoclaveNumber}_${new Date().toISOString().split('T')[0].replace(/-/g, '')}`,
//                 autoclaveId: parseInt(formData.autoclaveNumber, 10),
//                 // Initialize with empty values
//             };
            
//             // Update with current form values
//             Object.entries(formData).forEach(([key, value]) => {
//                 if (key === 'batchesProcessed' && Array.isArray(value)) {
//                     autoclaveRecord[key] = value.join(', ');
//                 } else if (key.includes('Pressure') && value) {
//                     autoclaveRecord[key] = parseFloat(value);
//                 } else {
//                     autoclaveRecord[key] = value;
//                 }
//             });
            
//             // Either update existing or add new
//             if (existingAutoclave) {
//                 const updatedAutoclaves = autoclaves.map(a => 
//                     a.autoclaveId === existingAutoclaveId ? autoclaveRecord : a
//                 );
//                 setAutoclaves(updatedAutoclaves);
//             } else {
//                 addAutoclave(autoclaveRecord);
//             }
            
//             // If this is the final stage, update batch statuses
//             const currentStage = AUTOCLAVE_STAGES[activeTab];
//             if (currentStage.key === 'doorOpen') {
//                 formData.batchesProcessed.forEach(id => {
//                     updateBatchStage(id, 'autoclave', 'completed');
//                     updateBatchStage(id, 'segregation', 'in-progress');
//                 });
                
//                 // Clear saved form progress after completion
//                 AsyncStorage.removeItem(getStorageKey());
                
//                 Alert.alert(
//                     'Process Complete',
//                     'Autoclave process has been completed and all data saved.',
//                     [{ text: 'OK', onPress: () => router.navigate('/(tabs)/(screens)/(autoclave-screens)/autoclave') }]
//                 );
//             } else {
//                 Alert.alert(
//                     'Stage Saved',
//                     `${currentStage.label} data has been saved.`,
//                     [{ text: 'Continue' }]
//                 );
//             }
            
//             return true;
//         } catch (error) {
//             console.error('Error saving stage:', error);
//             Alert.alert('Error', 'Failed to save stage data. Please try again.');
//             return false;
//         }
//     };

//     // Render tabs for navigation between stages
//     const renderStageTabs = () => (
//         <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.tabsContainer}
//         >
//             {AUTOCLAVE_STAGES.map((stage, index) => {
//                 const isActive = index === activeTab;
//                 const isCompleted = stageCompleted[stage.key];
//                 return (
//                     <TouchableOpacity
//                         key={stage.key}
//                         style={[
//                             styles.tabButton,
//                             isActive && styles.activeTab,
//                             isCompleted && styles.completedTab
//                         ]}
//                         onPress={() => setActiveTab(index)}
//                     >
//                         <Text style={[
//                             styles.tabText,
//                             isActive && styles.activeTabText,
//                             isCompleted && styles.completedTabText
//                         ]}>
//                             {stage.label}
//                             {stage.required ? ' *' : ''}
//                         </Text>
//                         {isCompleted && (
//                             <FontAwesome name="check-circle" size={14} color="#4CAF50" style={styles.tabCheckIcon} />
//                         )}
//                     </TouchableOpacity>
//                 );
//             })}
//         </ScrollView>
//     );

//     // Render the current stage content
//     const renderStageContent = () => {
//         switch (activeTab) {
//             case 0: // Basic Information
//                 return (
//                     <View style={styles.formSection}>
//                         {/* Autoclave Number */}
//                         {/* Shift */}
//                         {/* Batches Processed */}
//                         {/* Previous Door Open Time & Pressure */}
//                         {/* ... form fields for this stage ... */}
//                     </View>
//                 );
            
//             case 1: // Door Close
//                 return (
//                     <View style={styles.formSection}>
//                         {/* Door Close Time & Pressure fields */}
//                     </View>
//                 );
            
//             // Additional cases for other stages
//             // ...
            
//             default:
//                 return null;
//         }
//     };

//     if (isLoading) {
//         return (
//             <ThemedView style={[styles.container, styles.loadingContainer]}>
//                 <ActivityIndicator size="large" color="#00D2E6" />
//                 <Text style={styles.loadingText}>Loading autoclave data...</Text>
//             </ThemedView>
//         );
//     }

//     return (
//         <ThemedView style={styles.container}>
//             <ScreenHeader
//                 title="Autoclave Form"
//                 subtitle={`Autoclave #${autoclaveNumber} - Stage ${activeTab + 1}`}
//                 icon="thermometer-full"
//                 headerAnim={headerAnim}
//                 onBack={() => router.back()}
//             />

//             <AutoclaveBanner
//                 autoclaveNumber={autoclaveNumber}
//                 shift={watch('shift')}
//                 stage={AUTOCLAVE_STAGES[activeTab].label}
//             />

//             {/* Stage tabs for navigation */}
//             {renderStageTabs()}

//             <FormContainer fadeAnim={fadeAnim} scaleAnim={scaleAnim}>
//                 {/* Current stage content */}
//                 {renderStageContent()}

//                 {/* Stage action buttons */}
//                 <View style={styles.actionButtonsContainer}>
//                     <TouchableOpacity
//                         style={[styles.navButton, activeTab === 0 && styles.disabledButton]}
//                         onPress={() => setActiveTab(prev => Math.max(0, prev - 1))}
//                         disabled={activeTab === 0}
//                     >
//                         <FontAwesome name="chevron-left" size={16} color={activeTab === 0 ? "#ccc" : "#fff"} />
//                         <Text style={styles.navButtonText}>Previous</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={styles.saveStageButton}
//                         onPress={saveCurrentStage}
//                     >
//                         <FontAwesome name="save" size={16} color="#fff" />
//                         <Text style={styles.saveButtonText}>
//                             Save {AUTOCLAVE_STAGES[activeTab].label}
//                         </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[
//                             styles.navButton, 
//                             activeTab === AUTOCLAVE_STAGES.length - 1 && styles.disabledButton,
//                             !canMoveToNextStage() && styles.disabledButton
//                         ]}
//                         onPress={() => setActiveTab(prev => Math.min(AUTOCLAVE_STAGES.length - 1, prev + 1))}
//                         disabled={activeTab === AUTOCLAVE_STAGES.length - 1 || !canMoveToNextStage()}
//                     >
//                         <Text style={styles.navButtonText}>Next</Text>
//                         <FontAwesome name="chevron-right" size={16} color={(activeTab === AUTOCLAVE_STAGES.length - 1 || !canMoveToNextStage()) ? "#ccc" : "#fff"} />
//                     </TouchableOpacity>
//                 </View>

//                 {/* Progress indicator */}
//                 <View style={styles.progressContainer}>
//                     <View style={styles.progressBarContainer}>
//                         <View
//                             style={[
//                                 styles.progressBar,
//                                 {
//                                     width: `${((activeTab + 1) / AUTOCLAVE_STAGES.length) * 100}%`
//                                 }
//                             ]}
//                         />
//                     </View>
//                     <Text style={styles.progressText}>
//                         Stage {activeTab + 1} of {AUTOCLAVE_STAGES.length}
//                     </Text>
//                 </View>
//             </FormContainer>
//         </ThemedView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 0
//     },
//     loadingContainer: {
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     loadingText: {
//         fontSize: 18,
//         color: '#666',
//         marginTop: 16
//     },
    
//     // Tab styles
//     tabsContainer: {
//         flexDirection: 'row',
//         marginHorizontal: 16,
//         marginBottom: 10
//     },
//     tabButton: {
//         paddingVertical: 8,
//         paddingHorizontal: 12,
//         borderRadius: 20,
//         marginRight: 8,
//         backgroundColor: '#f0f0f0',
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     activeTab: {
//         backgroundColor: '#00D2E6',
//     },
//     completedTab: {
//         backgroundColor: '#e6f7f9',
//         borderWidth: 1,
//         borderColor: '#4CAF50'
//     },
//     tabText: {
//         fontSize: 14,
//         color: '#666'
//     },
//     activeTabText: {
//         color: '#fff',
//         fontWeight: 'bold'
//     },
//     completedTabText: {
//         color: '#00A388',
//         fontWeight: '500'
//     },
//     tabCheckIcon: {
//         marginLeft: 4
//     },
    
//     // Form styles
//     formSection: {
//         marginBottom: 20
//     },
    
//     // Action buttons
//     actionButtonsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 20
//     },
//     navButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#00A3B4',
//         paddingVertical: 10,
//         paddingHorizontal: 12,
//         borderRadius: 8,
//         minWidth: 100
//     },
//     disabledButton: {
//         backgroundColor: '#E0E0E0'
//     },
//     navButtonText: {
//         color: '#fff',
//         fontWeight: '600',
//         marginHorizontal: 4
//     },
//     saveStageButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#4CAF50',
//         paddingVertical: 10,
//         paddingHorizontal: 16,
//         borderRadius: 8,
//         justifyContent: 'center'
//     },
//     saveButtonText: {
//         color: '#fff',
//         fontWeight: '600',
//         marginLeft: 8
//     },
    
//     // Progress indicator
//     progressContainer: {
//         marginTop: 20,
//         alignItems: 'center'
//     },
//     progressBarContainer: {
//         width: '100%',
//         height: 6,
//         backgroundColor: '#E0E0E0',
//         borderRadius: 3,
//         overflow: 'hidden',
//         marginBottom: 8
//     },
//     progressBar: {
//         height: '100%',
//         backgroundColor: '#00A3B4',
//         borderRadius: 3
//     },
//     progressText: {
//         fontSize: 14,
//         color: '#666'
//     }
// });