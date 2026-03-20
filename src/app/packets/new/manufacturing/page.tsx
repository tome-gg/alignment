import { ManufacturingPacketForm } from "@/components/ManufacturingPacketForm";
import { requireSessionUser } from "@/lib/session";

export default async function NewManufacturingPacketPage() {
  await requireSessionUser();

  return <ManufacturingPacketForm />;
}
