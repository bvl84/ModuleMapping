import type { Metadata } from "next";
import { MapperView } from "@/components/MapperView";

export const metadata: Metadata = {
  title: "Cinch — Module Mapper 3000",
  description: "Cinch workflow module configuration",
};

export default function CinchPage() {
  return <MapperView tab="cinch" />;
}
