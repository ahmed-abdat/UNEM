// src/components/Confetti.jsx
import React, { forwardRef, useImperativeHandle, memo, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";

const Confetti = memo(forwardRef((props, ref) => {
  // Memoize the confetti colors to prevent recreation on every render
  const colors = useMemo(() => ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"], []);
  
  // Memoize the confetti configuration objects
  const leftConfettiConfig = useMemo(() => ({
    particleCount: 2,
    angle: 60,
    spread: 55,
    startVelocity: 60,
    origin: { x: 0, y: 0.5 },
    colors: colors,
  }), [colors]);

  const rightConfettiConfig = useMemo(() => ({
    particleCount: 2,
    angle: 120,
    spread: 55,
    startVelocity: 60,
    origin: { x: 1, y: 0.5 },
    colors: colors,
  }), [colors]);

  const fireConfetti = useCallback(() => {
    const end = Date.now() + 3 * 1000; // 3 seconds

    const frame = () => {
      if (Date.now() > end) return;
      confetti(leftConfettiConfig);
      confetti(rightConfettiConfig);
      requestAnimationFrame(frame);
    };

    frame();
  }, [leftConfettiConfig, rightConfettiConfig]);

  useImperativeHandle(ref, () => ({
    fire: fireConfetti
  }), [fireConfetti]);

  return <div className={props.className}></div>;
}));

Confetti.displayName = 'Confetti';

export default Confetti;
