import { TestvorlageVorschau } from "@/components/admin/testvorlage-vorschau";

/** Rahmenlose Vorschau der Testvorlage. Die Daten kommen per postMessage vom Editor (gleicher Ursprung). */
export default function Page() {
  return <TestvorlageVorschau />;
}
