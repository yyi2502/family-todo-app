// user
export type UserType = {
  id: string;
  name: string;
  email: string | null;
  created_by: string;
  image_path: string | null;
  created_at: Date;
  updated_at: Date;
  total_points: number;
  role: "parent" | "child";
};

// todo
export type TodoType = {
  id: string;
  created_by: string;
  title: string;
  description: string;
  status: "pending" | "processing" | "completed";
  created_at: Date;
  updated_at: Date;
  points: number;
  is_recommended: boolean;
  child_id: string;
};

export type TodoPropsType = {
  status?: "pending" | "processing" | "completed";
  is_recommended?: boolean;
  child_id?: string;
};

export type AddTodoPropsType = {
  title: string;
  created_by: string;
  points: number;
  description?: string;
  is_recommended: boolean;
};

export type UpdateTodoPropsType = {
  title?: string;
  description?: string;
  points?: number;
  status: "pending" | "processing" | "completed";
  child_id?: string;
};

export type TodoStoreType = {
  refetchTodo: boolean;
  setRefetchTodo: (value: boolean) => void;
};

// reward
export type RewardType = {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  child_id: string | null;
  required_points: number;
  is_active: boolean;
};

export type RewardPropsType = {
  child_id?: string;
  required_points?: number;
  is_active?: boolean;
};

export type RewardStoreType = {
  refetchReward: boolean;
  setRefetchReward: (value: boolean) => void;
};

export type AddRewardPropsType = {
  title: string;
  description?: string | null;
  created_by: string;
  required_points: number;
  is_active: boolean;
};
