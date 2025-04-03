export const statusOptions = [
  { value: "pending", label: "まだやらないよ！" },
  { value: "processing", label: "今やってるよ！" },
  { value: "completed", label: "できたよ！" },
];

// ステータスの `value` から `label` を取得するヘルパー関数
export const getStatusLabel = (value: string): string => {
  return (
    statusOptions.find((option) => option.value === value)?.label ||
    "不明なステータス"
  );
};
