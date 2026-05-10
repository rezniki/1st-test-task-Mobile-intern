import { useCallback, useEffect, useMemo, useState } from 'react';
import { taskStorage } from '../storage/taskStorage';
import { SortOrder, Task, TaskStatus } from '../types/task';

interface CreateTaskInput {
  title: string;
  description: string;
  address: string;
  dueDate: string;
}

interface UseTaskStoreResult {
  tasks: Task[];
  isLoading: boolean;
  sortOrder: SortOrder;
  errorMessage: string | null;
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleSortOrder: () => void;
  clearError: () => void;
}

export const useTaskStore = (): UseTaskStoreResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const initialTasks = await taskStorage.readTasks();
        setTasks(initialTasks);
      } catch (error) {
        setErrorMessage('Could not load saved tasks.');
      } finally {
        setIsLoading(false);
      }
    };
    void loadTasks();
  }, []);

  const persistTasks = useCallback(async (nextTasks: Task[]) => {
    try {
      await taskStorage.saveTasks(nextTasks);
      setTasks(nextTasks);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to save changes. Please try again.');
    }
  }, []);

  const createTask = useCallback(
    async (input: CreateTaskInput) => {
      const nextTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: input.title.trim(),
        description: input.description.trim(),
        address: input.address.trim(),
        dueDate: input.dueDate,
        createdAt: new Date().toISOString(),
        status: 'In Progress'
      };

      await persistTasks([nextTask, ...tasks]);
    },
    [persistTasks, tasks]
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      const nextTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      );
      await persistTasks(nextTasks);
    },
    [persistTasks, tasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      const nextTasks = tasks.filter((task) => task.id !== taskId);
      await persistTasks(nextTasks);
    },
    [persistTasks, tasks]
  );

  const sortedTasks = useMemo(() => {
    const clone = [...tasks];
    clone.sort((a, b) => {
      const first = new Date(a.createdAt).getTime();
      const second = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? first - second : second - first;
    });
    return clone;
  }, [sortOrder, tasks]);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    tasks: sortedTasks,
    isLoading,
    sortOrder,
    errorMessage,
    createTask,
    updateTaskStatus,
    deleteTask,
    toggleSortOrder,
    clearError
  };
};
