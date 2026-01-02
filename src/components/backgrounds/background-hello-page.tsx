"use client";

import { useState } from "react";
import { MeshGradient, DotOrbit } from "@paper-design/shaders-react";

export default function HelloPageBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [speed] = useState(1.0);
  const [activeEffect] = useState("mesh");

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div
        style={{
          opacity: 0.08,
        }}
      >
        {activeEffect === "mesh" && (
          <MeshGradient
            className="w-full h-full absolute inset-0"
            colors={["#000000", "#1a1a1a", "#333333", "#ffffff"]}
            speed={speed}
          />
        )}
      </div>
      <div className="relative z-100">{children}</div>
    </div>
  );
}
