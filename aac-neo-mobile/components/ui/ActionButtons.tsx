// // components/ui/ActionButtons.tsx
// import React from 'react';
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Dimensions,
//     Animated
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { router } from 'expo-router';

// const { width } = Dimensions.get('window');

// interface ActionButtonsProps {
//     onSubmit: () => void;
//     onCancel?: () => void;
//     submitText?: string;
//     cancelText?: string;
//     fadeAnim?: Animated.Value;
//     disabled?: boolean;
//     loading?: boolean;
// }

// export function ActionButtons({
//     onSubmit,
//     onCancel,
//     submitText = 'Submit',
//     cancelText = 'Cancel',
//     fadeAnim,
//     disabled = false,
//     loading = false
// }: ActionButtonsProps) {
//     // Default fadeAnim if not provided
//     const defaultAnim = React.useMemo(() => new Animated.Value(1), []);
//     const animValue = fadeAnim || defaultAnim;

//     const handleCancel = () => {
//         if (onCancel) {
//             onCancel();
//         } else {
//             router.back();
//         }
//     };

//     return (
//         <Animated.View
//             style={[
//                 styles.buttonContainer,
//                 fadeAnim && {
//                     opacity: animValue,
//                     transform: [{
//                         translateY: animValue.interpolate({
//                             inputRange: [0, 1],
//                             outputRange: [20, 0]
//                         })
//                     }]
//                 }
//             ]}
//         >
//             <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={handleCancel}
//                 disabled={loading}
//             >
//                 <Text style={styles.cancelButtonText}>{cancelText}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={[
//                     styles.submitButton,
//                     disabled && styles.disabledButton
//                 ]}
//                 onPress={onSubmit}
//                 disabled={disabled || loading}
//             >
//                 <LinearGradient
//                     colors={disabled ? ['#cccccc', '#999999'] : ['#00D2E6', '#0088cc']}
//                     style={styles.submitButtonGradient}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                 >
//                     <Text style={styles.submitButtonText}>
//                         {loading ? 'Submitting...' : submitText}
//                     </Text>
//                 </LinearGradient>
//             </TouchableOpacity>
//         </Animated.View>
//     );
// }

// const styles = StyleSheet.create({
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     cancelButton: {
//         flex: 1,
//         backgroundColor: '#F0F0F0',
//         borderRadius: 12,
//         paddingVertical: 14,
//         marginRight: 8,
//         alignItems: 'center',
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//     },
//     cancelButtonText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#666666',
//     },
//     submitButton: {
//         flex: 1,
//         marginLeft: 8,
//         borderRadius: 12,
//         overflow: 'hidden',
//         elevation: 3,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.15,
//         shadowRadius: 3,
//     },
//     disabledButton: {
//         opacity: 0.7,
//     },
//     submitButtonGradient: {
//         width: '100%',
//         paddingVertical: 14,
//         alignItems: 'center',
//     },
//     submitButtonText: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#FFFFFF',
//     },
// });

// components/ui/ActionButtons.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ActionButtonsProps {
  onSubmit: () => void;
  onCancel: () => void;
  fadeAnim?: Animated.Value;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSubmit,
  onCancel,
  fadeAnim,
  submitDisabled = false,
  cancelDisabled = false,
  loading = false,
  submitText = 'Submit',
  cancelText = 'Cancel'
}) => {
  const defaultAnim = React.useMemo(() => new Animated.Value(1), []);
  const animValue = fadeAnim || defaultAnim;

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        fadeAnim && {
          opacity: animValue,
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }
          ]
        }
      ]}
    >
      <TouchableOpacity
        style={[styles.cancelButton, cancelDisabled && styles.disabledButton]}
        onPress={onCancel}
        disabled={cancelDisabled || loading}
      >
        <Text style={styles.cancelButtonText}>{cancelText}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, submitDisabled && styles.disabledButton]}
        onPress={onSubmit}
        disabled={submitDisabled || loading}
      >
        <LinearGradient
          colors={
            submitDisabled ? ['#cccccc', '#999999'] : ['#00D2E6', '#0088cc']
          }
          style={styles.submitButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : submitText}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666'
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3
  },
  disabledButton: {
    opacity: 0.7
  },
  submitButtonGradient: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF'
  }
});
