export type TaskStatus = 'In Progress' | 'Completed' | 'Cancelled';

export type SortOrder = 'asc' | 'desc';

export interface Task {
  id: string;
  title: string;
  description: string;
  address: string;
  dueDate: string;
  createdAt: string;
  status: TaskStatus;
}

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: undefined;
  TaskDetails: { taskId: string };
};
