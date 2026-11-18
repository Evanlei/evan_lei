"use client";

import { useEffect } from "react";
import { initClimb } from "@/lib/climb-scene";

/** Starts the mountain scene once the server-rendered page is in the DOM. */
export default function ClimbScene() {
  useEffect(() => {
    initClimb();
  }, []);
  return null;
}
