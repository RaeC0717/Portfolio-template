"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { usePhotoPosition } from "@/hooks/usePhotoPosition";

const SENSITIVITY = 0.2; // px drag -> % position change
const MIN_SCALE = 1; // 不能小于展示框
const MAX_SCALE = 2.5;
const WHEEL_ZOOM_SPEED = 0.004;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function SyncPhotoHint({
  position,
  scale,
}: {
  position: { x: number; y: number };
  scale: number;
}) {
  const [copied, setCopied] = useState(false);
  const handleSync = useCallback(() => {
    const json = JSON.stringify({ x: position.x, y: position.y, scale });
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [position.x, position.y, scale]);

  return (
    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono text-center max-w-[300px]">
      <span className="text-neutral-400">拖动平移 · 滚轮缩放</span>
      <br />
      <button
        type="button"
        onClick={handleSync}
        className="mt-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 underline underline-offset-1"
      >
        {copied ? "已复制，请运行 npm run sync-photo-position" : "同步到用户端（复制后运行同步命令）"}
      </button>
    </div>
  );
}

export default function Hero() {
  const { position, setPosition, scale, setScale, positionString } = usePhotoPosition();
  const [isDragging, setIsDragging] = useState(false);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const isDev = process.env.NODE_ENV === "development";

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isDev) return;
      e.preventDefault();
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [isDev]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDev || !isDragging) return;
      setPosition((prev) => {
        const next = {
          x: clamp(prev.x - e.movementX * SENSITIVITY, 0, 100),
          y: clamp(prev.y - e.movementY * SENSITIVITY, 0, 100),
        };
        return next;
      });
    },
    [isDev, isDragging, setPosition]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDev) return;
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
    [isDev]
  );

  // Note: position and scale are automatically saved to localStorage by usePhotoPosition hook
  // so IntroGate and Hero will both use the same values

  // In dev: wheel zoom with passive: false so preventDefault works (stops page scroll)
  useEffect(() => {
    if (!isDev || !photoContainerRef.current) return;
    const el = photoContainerRef.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((prev) => clamp(prev - e.deltaY * WHEEL_ZOOM_SPEED, MIN_SCALE, MAX_SCALE));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isDev]);

  return (
    <section
      id="hero"
      className="min-h-[85vh] flex flex-col justify-center section-padding"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 gap-8 animate__animated animate__slideInDown">
        <div className="flex-shrink-0 flex flex-col items-center gap-2 lg:order-2">
          <div
            ref={photoContainerRef}
            className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-neutral-200 dark:border-neutral-600 shadow-lg animate-fade-in-up select-none"
            style={{
              animationDelay: "0.15s",
              opacity: 0,
              ...(isDev && { cursor: isDragging ? "grabbing" : "grab" }),
            }}
            {...(isDev && {
              onPointerDown: handlePointerDown,
              onPointerMove: handlePointerMove,
              onPointerUp: handlePointerUp,
              onPointerLeave: (e: React.PointerEvent) => isDragging && handlePointerUp(e),
            })}
          >
            <Image
              src="/photo.png"
              alt="Feiyang Chen"
              fill
              sizes="(max-width: 1024px) 224px, 256px"
              className="object-cover pointer-events-none"
              style={{
                objectPosition: positionString,
                transform: `scale(${scale})`,
                transformOrigin: positionString,
              }}
              priority
              draggable={false}
            />
          </div>
          {isDev && (
            <SyncPhotoHint position={position} scale={scale} />
          )}
        </div>
        <div className="lg:order-1">
          <p
            className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base mb-3 animate-fade-in"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            Hi, I&apos;m
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-4 animate-fade-in-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            Feiyang Chen
          </h1>
          <p
            className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-300 mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.35s", opacity: 0 }}
          >
            Data Science & Mathematics
          </p>
          <p
            className="text-neutral-600 dark:text-neutral-400 max-w-xl mb-8 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.5s", opacity: 0 }}
          >
            I build data pipelines, run statistical analyses, and turn complex
            datasets into clear insights. Currently working in computational biology
            at the Michigan Neuroscience Institute.
          </p>
          <div
            className="flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.65s", opacity: 0 }}
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 touch-manipulation"
            >
              Get in touch
            </a>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-md hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:hover:border-neutral-500 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 touch-manipulation"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
