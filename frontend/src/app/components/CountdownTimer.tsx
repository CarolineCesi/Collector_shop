import { useState, useEffect } from "react";

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let timeLeft = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex gap-2 text-zinc-950 font-mono font-bold text-2xl md:text-3xl tracking-tighter bg-orange-500 py-2 px-4 rounded-lg inline-block shadow-[0_0_15px_rgba(255,95,31,0.5)]">
      <span>{formatNumber(timeLeft.hours)}</span>
      <span className="opacity-50 animate-pulse">:</span>
      <span>{formatNumber(timeLeft.minutes)}</span>
      <span className="opacity-50 animate-pulse">:</span>
      <span>{formatNumber(timeLeft.seconds)}</span>
    </div>
  );
}
