import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { TaskCard } from '../components/TaskCard';
import { RootStackParamList, SortOrder, Task } from '../types/task';
import { AppColors } from '../ui/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'> & {
  tasks: Task[];
  sortOrder: SortOrder;
  isLoading: boolean;
  errorMessage: string | null;
  onToggleSortOrder: () => void;
  onClearError: () => void;
  colors: AppColors;
};

export const TaskListScreen = ({
  navigation,
  tasks,
  sortOrder,
  isLoading,
  errorMessage,
  onToggleSortOrder,
  onClearError,
  colors
}: Props) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {errorMessage ? (
        <Pressable
          onPress={onClearError}
          style={[styles.errorBox, { borderColor: colors.danger, backgroundColor: colors.card }]}
        >
          <Text style={[styles.errorText, { color: colors.danger }]}>{errorMessage}</Text>
          <Text style={[styles.errorHint, { color: colors.textSecondary }]}>Tap to dismiss</Text>
        </Pressable>
      ) : null}

      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('TaskForm')}
        >
          <Text style={styles.actionButtonText}>+ New Task</Text>
        </Pressable>
        <Pressable
          style={[styles.sortButton, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={onToggleSortOrder}
        >
          <Text style={[styles.sortButtonText, { color: colors.textPrimary }]}>
            Sort: {sortOrder.toUpperCase()}
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading tasks...</Text>
      ) : (
        <FlatList
          contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : styles.listContainer}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              colors={colors}
              onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No tasks yet</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Create your first task to start planning field work.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  actionButton: {
    minHeight: 52,
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16
  },
  sortButton: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14
  },
  sortButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  listContainer: {
    paddingBottom: 30
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700'
  },
  emptyText: {
    fontSize: 16,
    marginTop: 8
  },
  errorBox: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600'
  },
  errorHint: {
    fontSize: 14,
    marginTop: 4
  }
});
