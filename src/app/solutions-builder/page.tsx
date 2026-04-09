import type { Metadata } from "next";
import { MapperView } from "@/components/MapperView";

export const metadata: Metadata = {
  title: "Solutions Builder — Module Mapper 3000",
  description: "Solutions Builder workflow module configuration",
};

export default function SolutionsBuilderPage() {
  return <MapperView tab="solutions" />;
}
