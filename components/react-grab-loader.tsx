"use client";

import { useEffect } from "react";

export default function ReactGrabLoader() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      void import("react-grab");
    }
  }, []);

  return null;
}
