import type { Metadata } from "next";
import { MapperView } from "@/components/MapperView";

export const metadata: Metadata = {
  title: "Comparison — Module Mapper 3000",
  description: "Workflow module comparison",
};

export default function ComparisonPage() {
  return <MapperView tab="comparison" />;
}
