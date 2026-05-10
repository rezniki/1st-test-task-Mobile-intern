import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';
import { AppColors } from '../ui/colors';
import { formatTaskDate } from '../utils/date';
import { TaskStatusBadge } from './TaskStatusBadge';

interface TaskCardProps {
  task: Task;
  colors: AppColors;
  onPress: () => void;
}

export const TaskCard = ({ task, colors, onPress }: TaskCardProps) => (
  <Pressable
    style={({ pressed }) => [
      styles.container,
      {
        backgroundColor: colors.card,
        borderColor: colors.border,
        opacity: pressed ? 0.9 : 1
      }
    ]}
    onPress={onPress}
  >
    <View style={styles.topRow}>
      <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
        {task.title}
      </Text>
      <TaskStatusBadge status={task.status} colors={colors} />
    </View>
    <Text style={[styles.date, { color: colors.textSecondary }]}>
      Due: {formatTaskDate(task.dueDate)}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700'
  },
  date: {
    marginTop: 8,
    fontSize: 16
  }
});
