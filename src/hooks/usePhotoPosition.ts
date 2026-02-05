import { useState, useEffect, useCallback } from "react";
import { PHOTO_POSITION_DEFAULTS } from "@/config/photoPosition";

const STORAGE_KEY = "portfolio-hero-photo-position";
const isDev = process.env.NODE_ENV === "development";

type SavedPhoto = { x: number; y: number; scale?: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Shared hook for hero photo position and scale.
 * - Production: uses only PHOTO_POSITION_DEFAULTS from config (same for all users; no localStorage).
 * - Development: uses config as initial values; localStorage overrides on mount and is written on change (dev-only editing).
 */
export function usePhotoPosition() {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: PHOTO_POSITION_DEFAULTS.x,
    y: PHOTO_POSITION_DEFAULTS.y,
  });
  const [scale, setScale] = useState<number>(PHOTO_POSITION_DEFAULTS.scale);
  const [mounted, setMounted] = useState(false);

  // On mount: in dev only, read from localStorage to override config
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined" || !isDev) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SavedPhoto;
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          setPosition({
            x: clamp(parsed.x, 0, 100),
            y: clamp(parsed.y, 0, 100),
          });
        }
        if (typeof parsed.scale === "number") {
          setScale(clamp(parsed.scale, 1, 2.5));
        }
      }
    } catch {
      // ignore, use config defaults
    }
  }, []);

  // In dev only: save to localStorage when position/scale change (so dev can sync to config and deploy)
  useEffect(() => {
    if (!mounted || typeof window === "undefined" || !isDev) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...position, scale }));
    } catch {
      // ignore
    }
  }, [mounted, position, scale]);

  const savePosition = useCallback(
    (pos: { x: number; y: number }, s: number) => {
      if (typeof window === "undefined" || !isDev) return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...pos, scale: s }));
      } catch {
        // ignore
      }
    },
    []
  );

  return {
    position,
    setPosition,
    scale,
    setScale,
    mounted,
    savePosition,
    positionString: `${position.x}% ${position.y}%`,
  };
}
