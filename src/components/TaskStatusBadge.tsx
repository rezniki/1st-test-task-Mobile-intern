import { StyleSheet, Text, View } from 'react-native';
import { TaskStatus } from '../types/task';
import { AppColors } from '../ui/colors';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  colors: AppColors;
}

const getStatusColor = (status: TaskStatus, colors: AppColors): string => {
  if (status === 'Completed') {
    return colors.success;
  }
  if (status === 'Cancelled') {
    return colors.danger;
  }
  return colors.warning;
};

export const TaskStatusBadge = ({ status, colors }: TaskStatusBadgeProps) => (
  <View
    style={[
      styles.container,
      { borderColor: getStatusColor(status, colors), backgroundColor: colors.card }
    ]}
  >
    <Text style={[styles.text, { color: getStatusColor(status, colors) }]}>{status}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  text: {
    fontSize: 14,
    fontWeight: '700'
  }
});
