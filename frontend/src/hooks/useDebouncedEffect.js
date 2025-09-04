import { useEffect, useRef } from "react";

export default function useDebouncedEffect(effect, deps, delay = 800) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const handler = setTimeout(effect, delay);
    return () => clearTimeout(handler);
  }, deps);
}
