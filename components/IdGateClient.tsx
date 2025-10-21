"use client";

import dynamic from "next/dynamic";

// tắt SSR để tránh xung đột hydration/dialog
const IdGate = dynamic(
  () => import("./id-gate-modal").then((m) => m.IdGateModal),
  {
    ssr: false,
  }
);

export function IdGateClient() {
  return <IdGate autoOpenOnMount />;
}
