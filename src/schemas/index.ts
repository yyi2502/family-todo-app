import { z } from "zod";

// 会員登録用Schema
export const SignupSchema = z.object({
  name: z.string().min(1, {
    message: "お名前を入力してください",
  }),
  email: z.string().email({
    message: "メールアドレスを入力してください",
  }),
  password: z.string().min(8, {
    message: "英数字8文字以上で入力してください",
  }),
});

// ログイン用Schema
export const SigninSchema = z.object({
  email: z.string().email({
    message: "メールアドレスを入力してください",
  }),
  password: z.string().min(8, {
    message: "英数字8文字以上で入力してください",
  }),
});

// 子ユーザ追加用Schema
export const AddChildSchema = z.object({
  name: z.string().min(1, {
    message: "お名前を入力してください",
  }),
});

// 子ユーザ更新用Schema
export const UpdateChildSchema = z.object({
  name: z.string().min(1, {
    message: "お名前を入力してください",
  }),
  points: z.number().min(0).int(),
});

// Todo追加用Schema
export const AddTodoSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .transform((t) => t.trim()),
  description: z.string().optional(),
  points: z.number().min(0).int(),
  is_recommended: z.boolean(),
  child_id: z.string().optional(),
  status: z.enum(["pending", "processing", "completed"]),
});

// Todo更新用Schema
export const UpdateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .transform((t) => t.trim()),
  description: z.string().optional(),
  points: z.number().min(0).int(),
  is_recommended: z.boolean(),
  child_id: z.string().optional(),
  status: z.enum(["pending", "processing", "completed"]),
});

// リワード追加用Schema
export const AddRewardSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .transform((t) => t.trim()),
  description: z.string().optional(),
  required_points: z.number().min(1).int(),
});

// リワード編集用Schema
export const UpdateRewardSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .transform((t) => t.trim()),
  description: z.string().optional(),
  required_points: z.number().min(1).int(),
});
