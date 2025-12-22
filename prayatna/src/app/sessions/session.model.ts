export interface Subtask {
  subtaskName: string;
  duration: number; // seconds
}

export interface Task {
  taskName: string;
  hasSubtasks: boolean;
  taskDuration: number; // seconds
  typeLabel?: string;
  subtasks?: Subtask[];
}

export interface Session {
  sessionName: string;
  isTimed: boolean;
  totalDuration?: number; // seconds
  tasks: Task[];
}