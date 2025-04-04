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

export type RewardType = {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  child_id: string | null;
  required_points: number;
  is_active: boolean;
};



export type AddTodoFormProps = {
  
}