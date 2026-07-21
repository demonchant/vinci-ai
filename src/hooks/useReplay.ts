"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import type { ReplayManifest, PredictionResult } from "@/types/replay";

interface ReplayState {
  manifest: ReplayManifest | null;
  predictions: PredictionResult | null;
  currentIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // ms per frame
  isLoading: boolean;
  demo: boolean;
}

type Action =
  | { type: "LOADED"; manifest: ReplayManifest; predictions: PredictionResult; demo: boolean }
  | { type: "SEEK"; index: number }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_SPEED"; ms: number }
  | { type: "ADVANCE" };

function reducer(state: ReplayState, action: Action): ReplayState {
  switch (action.type) {
    case "LOADED":
      return { ...state, manifest: action.manifest, predictions: action.predictions, demo: action.demo, isLoading: false, currentIndex: 0 };
    case "SEEK":
      return { ...state, currentIndex: Math.max(0, Math.min(action.index, (state.manifest?.totalFrames ?? 1) - 1)) };
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "NEXT":
      return { ...state, currentIndex: Math.min(state.currentIndex + 1, (state.manifest?.totalFrames ?? 1) - 1) };
    case "PREV":
      return { ...state, currentIndex: Math.max(state.currentIndex - 1, 0) };
    case "SET_SPEED":
      return { ...state, playbackSpeed: action.ms };
    case "ADVANCE": {
      const next = state.currentIndex + 1;
      const max = (state.manifest?.totalFrames ?? 1) - 1;
      if (next > max) return { ...state, isPlaying: false }; // end of replay
      return { ...state, currentIndex: next };
    }
    default:
      return state;
  }
}

const INITIAL: ReplayState = {
  manifest: null,
  predictions: null,
  currentIndex: 0,
  isPlaying: false,
  playbackSpeed: 800,
  isLoading: true,
  demo: false,
};

export function useReplay() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/dna/replay")
      .then((r) => r.json())
      .then((data) => {
        dispatch({ type: "LOADED", manifest: data.manifest, predictions: data.predictions, demo: data.demo });
      });
  }, []);

  // Ticker — advances one frame per playbackSpeed ms when playing
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (state.isPlaying) {
      intervalRef.current = setInterval(() => dispatch({ type: "ADVANCE" }), state.playbackSpeed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isPlaying, state.playbackSpeed]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case " ": e.preventDefault(); dispatch({ type: state.isPlaying ? "PAUSE" : "PLAY" }); break;
        case "ArrowRight": dispatch({ type: "NEXT" }); break;
        case "ArrowLeft": dispatch({ type: "PREV" }); break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.isPlaying]);

  const currentFrame = state.manifest?.frames[state.currentIndex] ?? null;
  const currentCompass = state.manifest?.compass[state.currentIndex] ?? null;
  const currentMilestone = state.manifest?.milestones.find((m) => m.frameIndex === state.currentIndex) ?? null;

  return {
    ...state,
    currentFrame,
    currentCompass,
    currentMilestone,
    seek: useCallback((i: number) => dispatch({ type: "SEEK", index: i }), []),
    play: useCallback(() => dispatch({ type: "PLAY" }), []),
    pause: useCallback(() => dispatch({ type: "PAUSE" }), []),
    next: useCallback(() => dispatch({ type: "NEXT" }), []),
    prev: useCallback(() => dispatch({ type: "PREV" }), []),
    setSpeed: useCallback((ms: number) => dispatch({ type: "SET_SPEED", ms }), []),
  };
}
