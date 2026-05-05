import type { Metadata } from "next";
import { FutureStateVisualPageClient } from "@/components/future-state/FutureStateVisualPageClient";

export const metadata: Metadata = {
  title: "Future State visual — Module Mapper 3000",
  description: "Visual flow of Future State workflow modules and configuration",
};

export default function FutureStateVisualPage() {
  return <FutureStateVisualPageClient />;
}
