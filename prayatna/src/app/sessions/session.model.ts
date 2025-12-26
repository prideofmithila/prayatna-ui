export interface Subtask {
  id?: number;
  subtaskName: string;
  duration: number; // seconds
  order?: number;
}

export interface Task {
  id?: number;
  taskName: string;
  hasSubtasks: boolean;
  taskDuration: number; // seconds
  order?: number;
  typeLabel?: string;
  subtasks?: Subtask[];
}

export interface Session {
  id?: number;
  sessionName: string;
  description?: string;
  isTimed: boolean;
  totalDuration?: number; // seconds
  tasks: Task[];
  isPredefined?: boolean;
}