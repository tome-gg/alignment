import { SoftwarePacketForm } from "@/components/SoftwarePacketForm";
import { requireSessionUser } from "@/lib/session";

export default async function NewSoftwarePacketPage() {
  await requireSessionUser();

  return <SoftwarePacketForm />;
}
