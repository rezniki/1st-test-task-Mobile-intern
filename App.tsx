import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TaskFormScreen } from './src/screens/TaskFormScreen';
import { TaskDetailsScreen } from './src/screens/TaskDetailsScreen';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { useTaskStore } from './src/store/useTaskStore';
import { RootStackParamList } from './src/types/task';
import { darkColors, lightColors } from './src/ui/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const systemTheme = useColorScheme();
  const isDark = systemTheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  const {
    tasks,
    isLoading,
    sortOrder,
    errorMessage,
    createTask,
    updateTaskStatus,
    deleteTask,
    toggleSortOrder,
    clearError
  } = useTaskStore();

  const navigationTheme: Theme = useMemo(
    () => ({
      dark: isDark,
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.primary
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' }
      }
    }),
    [colors, isDark]
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.textPrimary,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="TaskList" options={{ title: 'Tasks' }}>
            {(props) => (
              <TaskListScreen
                {...props}
                tasks={tasks}
                sortOrder={sortOrder}
                isLoading={isLoading}
                errorMessage={errorMessage}
                onToggleSortOrder={toggleSortOrder}
                onClearError={clearError}
                colors={colors}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="TaskForm" options={{ title: 'Create Task' }}>
            {(props) => (
              <TaskFormScreen
                {...props}
                onCreateTask={createTask}
                colors={colors}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="TaskDetails" options={{ title: 'Task Details' }}>
            {(props) => (
              <TaskDetailsScreen
                {...props}
                tasks={tasks}
                onUpdateStatus={updateTaskStatus}
                onDeleteTask={deleteTask}
                colors={colors}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
