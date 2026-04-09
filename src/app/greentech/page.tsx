import type { Metadata } from "next";
import { MapperView } from "@/components/MapperView";

export const metadata: Metadata = {
  title: "GreenTech — Module Mapper 3000",
  description: "GreenTech workflow module configuration",
};

export default function GreenTechPage() {
  return <MapperView tab="greentech" />;
}
