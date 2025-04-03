"use client";
import { useParams } from "next/navigation";

export default function RewardDetailPage() {
  const { id } = useParams();

  return id ? <RewardDetail rewardId={id} /> : <div>Todo ID is missing</div>;
}
