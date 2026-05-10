import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const TASKS_STORAGE_KEY = '@task-manager/tasks';

export const taskStorage = {
  async readTasks(): Promise<Task[]> {
    const rawValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedData = JSON.parse(rawValue) as Task[];
    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData;
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }
};
