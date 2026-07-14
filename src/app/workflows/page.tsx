import type { Metadata } from "next";
import { WorkflowsPageGuarded } from "@/components/workflows/WorkflowsPageGuarded";

export const metadata: Metadata = {
  title: "Workflows — Module Mapper 3000",
  description: "Browse existing client workflows or start a new configuration.",
};

export default function WorkflowsPage() {
  return <WorkflowsPageGuarded />;
}
