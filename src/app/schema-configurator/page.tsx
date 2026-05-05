import type { Metadata } from "next";
import { SchemaConfiguratorPageClient } from "@/components/schema-configurator/SchemaConfiguratorPageClient";

export const metadata: Metadata = {
  title: "Schema Configurator — Module Mapper 3000",
  description:
    "Visual configurator for the standardized client workflow JSON. Import a sample, edit, and export a new client config.",
};

export default function SchemaConfiguratorPage() {
  return <SchemaConfiguratorPageClient />;
}
