import confetti from "canvas-confetti";

export const runConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 360,
    scalar: 5, // 紙吹雪の大きさ
    origin: { x: 0.5, y: 0.5 },
  });
};
