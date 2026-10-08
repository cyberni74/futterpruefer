import { Loader2, Save } from "lucide-react";
import type { ReactNode } from "react";
import { btnPrimary } from "./ui";

export function SubmitButton({ pending, children = "Speichern", className = btnPrimary }: { pending: boolean; children?: ReactNode; className?: string }) {
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
      {children}
    </button>
  );
}
