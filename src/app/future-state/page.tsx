import type { Metadata } from "next";
import { MapperView } from "@/components/MapperView";

export const metadata: Metadata = {
  title: "Future State — Module Mapper 3000",
  description: "Future State config profile",
};

export default function FutureStatePage() {
  return <MapperView tab="future-state" />;
}
