import { useState, useEffect, useCallback } from "react";
import { PHOTO_POSITION_DEFAULTS } from "@/config/photoPosition";

const STORAGE_KEY = "portfolio-hero-photo-position";
const isDev = process.env.NODE_ENV === "development";

type SavedPhoto = { x: number; y: number; scale?: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const PHOTO_POSITION_JSON = "/photo-position.json";

/**
 * Shared hook for hero photo position and scale.
 * - Production: fetches /photo-position.json (deployed with sync script), fallback to config; no localStorage.
 * - Development: localStorage overrides if present; else fetches JSON; else config. Writes to localStorage on change.
 */
export function usePhotoPosition() {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: PHOTO_POSITION_DEFAULTS.x,
    y: PHOTO_POSITION_DEFAULTS.y,
  });
  const [scale, setScale] = useState<number>(PHOTO_POSITION_DEFAULTS.scale);
  const [mounted, setMounted] = useState(false);

  // On mount: fetch deployed JSON; in dev prefer localStorage
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const apply = (data: SavedPhoto) => {
      if (typeof data.x === "number" && typeof data.y === "number") {
        setPosition({ x: clamp(data.x, 0, 100), y: clamp(data.y, 0, 100) });
        if (typeof data.scale === "number") setScale(clamp(data.scale, 1, 2.5));
      }
    };

    let fromStorage: SavedPhoto | null = null;
    if (isDev) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) fromStorage = JSON.parse(saved) as SavedPhoto;
      } catch {
        // ignore
      }
    }

    fetch(PHOTO_POSITION_JSON)
      .then((r) => (r.ok ? r.json() : null))
      .then((json: SavedPhoto | null) => {
        if (isDev && fromStorage) apply(fromStorage);
        else if (json) apply(json);
      })
      .catch(() => {
        if (isDev && fromStorage) apply(fromStorage);
      });
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
