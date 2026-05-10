import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TaskStatusBadge } from '../components/TaskStatusBadge';
import { RootStackParamList, Task, TaskStatus } from '../types/task';
import { AppColors } from '../ui/colors';
import { formatTaskDate } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'> & {
  tasks: Task[];
  onUpdateStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  colors: AppColors;
};

const statuses: TaskStatus[] = ['In Progress', 'Completed', 'Cancelled'];

export const TaskDetailsScreen = ({
  route,
  navigation,
  tasks,
  onUpdateStatus,
  onDeleteTask,
  colors
}: Props) => {
  const task = tasks.find((item) => item.id === route.params.taskId);

  if (!task) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundTitle, { color: colors.textPrimary }]}>Task not found</Text>
        <Pressable style={[styles.backButton, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await onDeleteTask(task.id);
          navigation.popToTop();
        }
      }
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{task.title}</Text>
        <TaskStatusBadge status={task.status} colors={colors} />

        <InfoRow label="Description" value={task.description} colors={colors} />
        <InfoRow label="Address" value={task.address} colors={colors} />
        <InfoRow label="Due date" value={formatTaskDate(task.dueDate)} colors={colors} />
        <InfoRow label="Created at" value={formatTaskDate(task.createdAt)} colors={colors} />
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Change status</Text>
      <View style={styles.statusRow}>
        {statuses.map((statusOption) => (
          <Pressable
            key={statusOption}
            style={[
              styles.statusButton,
              {
                borderColor: task.status === statusOption ? colors.primary : colors.border,
                backgroundColor: colors.card
              }
            ]}
            onPress={() => void onUpdateStatus(task.id, statusOption)}
          >
            <Text
              style={[
                styles.statusButtonText,
                { color: task.status === statusOption ? colors.primary : colors.textPrimary }
              ]}
            >
              {statusOption}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={[styles.deleteButton, { backgroundColor: colors.danger }]} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete task</Text>
      </Pressable>
    </ScrollView>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  colors: AppColors;
}

const InfoRow = ({ label, value, colors }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 30
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12
  },
  infoRow: {
    marginTop: 12
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600'
  },
  infoValue: {
    fontSize: 16,
    marginTop: 4
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8
  },
  statusRow: {
    gap: 8
  },
  statusButton: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  deleteButton: {
    marginTop: 20,
    minHeight: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12
  },
  backButton: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  }
});
