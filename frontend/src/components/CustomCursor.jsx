import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export default function CustomCursor(){
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 28, stiffness: 420, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 420, mass: 0.4 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer || reducedMotion) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor-active");

    function handleMove(e){
      x.set(e.clientX);
      y.set(e.clientY);
    }
    function handleOver(e){
      setHovering(!!e.target.closest("a, button, input, select, textarea, [role='button']"));
    }
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <motion.div
      className="custom-cursor"
      style={{ translateX: springX, translateY: springY }}
      animate={{ scale: hovering ? 1.8 : 1 }}
      transition={{ duration: 0.2 }}
      aria-hidden="true"
    />
  );
}
