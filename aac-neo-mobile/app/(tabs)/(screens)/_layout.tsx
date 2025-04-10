import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function ScreensLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
                headerTintColor: Colors[colorScheme ?? 'light'].text,
                presentation: 'card',
                headerShown: false,
                animation: 'slide_from_right'
            }}>
        </Stack>
    );
}