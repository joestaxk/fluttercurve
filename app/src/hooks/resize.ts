import { useState, useEffect } from "react";

type ResizeType = [number, number];

export function useResize(): ResizeType {
  const [resize, setResize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setResize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return [resize.width, resize.height];
}