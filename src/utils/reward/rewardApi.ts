export const fetchAllRewards = async (is_active?: boolean) => {
  try {
    const url = new URL("/api/reward", window.location.origin);
    if (is_active) url.searchParams.append("is_active", String(is_active));

    const response = await fetch(url.toString());
    const rewards = await response.json();
    if (!response.ok) throw new Error(rewards.error);

    return rewards;
  } catch (err) {
    console.error("rewardsの取得に失敗しました", err);
    throw new Error("rewardsの取得に失敗しました");
  }
};
