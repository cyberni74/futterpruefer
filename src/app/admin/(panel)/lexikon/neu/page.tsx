import type { Metadata } from "next";
import { LexikonEditor } from "@/components/admin/lexikon-editor";
import { EMPTY_LEXIKON } from "@/lib/admin/lexikon";
import { saveLexikon } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Neuer Lexikon-Eintrag" };

export default function NewLexikonPage() {
  return <LexikonEditor initial={EMPTY_LEXIKON} action={saveLexikon.bind(null, null)} />;
}
