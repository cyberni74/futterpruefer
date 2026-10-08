"use client";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { autolinkUrls } from "@/lib/autolink";

const escapeText = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Props = {
  /** Name des versteckten Inputs, über den das HTML an die Server-Action geht */
  name: string;
  initialHtml?: string;
  id?: string;
  label?: string;
  onChange?: (html: string) => void;
};

function ToolButton({
  icon: Icon,
  label,
  onClick,
  active,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`inline-flex size-11 items-center justify-center rounded-lg transition disabled:opacity-40 ${
        active ? "bg-brand text-white dark:text-[#04201e]" : "text-fg hover:bg-bg-soft"
      }`}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}

function safeUrl(input: string | null, allowRelative: boolean): string | null {
  if (!input) return null;
  const v = input.trim();
  if (/^https?:\/\//i.test(v) || /^mailto:/i.test(v)) return v;
  if (allowRelative && v.startsWith("/") && !v.startsWith("//")) return v;
  return null;
}

function Toolbar({ editor, source, onToggleSource }: { editor: Editor | null; source: boolean; onToggleSource: () => void }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  });
  const dis = !editor || source;
  const chain = () => editor!.chain().focus();

  return (
    <div role="toolbar" aria-label="Textformatierung" className="flex flex-wrap items-center gap-0.5 border-b border-border bg-bg-soft p-1">
      <ToolButton icon={Heading2} label="Überschrift H2" active={s?.h2} disabled={dis} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
      <ToolButton icon={Heading3} label="Überschrift H3" active={s?.h3} disabled={dis} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
      <ToolButton icon={Bold} label="Fett" active={s?.bold} disabled={dis} onClick={() => chain().toggleBold().run()} />
      <ToolButton icon={Italic} label="Kursiv" active={s?.italic} disabled={dis} onClick={() => chain().toggleItalic().run()} />
      <ToolButton icon={List} label="Aufzählung" active={s?.bullet} disabled={dis} onClick={() => chain().toggleBulletList().run()} />
      <ToolButton icon={ListOrdered} label="Nummerierte Liste" active={s?.ordered} disabled={dis} onClick={() => chain().toggleOrderedList().run()} />
      <ToolButton icon={Quote} label="Zitat" active={s?.quote} disabled={dis} onClick={() => chain().toggleBlockquote().run()} />
      <ToolButton
        icon={Link2}
        label={s?.link ? "Link bearbeiten oder entfernen" : "Link einfügen"}
        active={s?.link}
        disabled={dis}
        onClick={() => {
          const prev = (editor!.getAttributes("link").href as string | undefined) ?? "";
          const input = window.prompt("Link-Adresse (https://… oder /pfad). Leer lassen zum Entfernen:", prev);
          if (input === null) return;
          if (input.trim() === "") {
            chain().extendMarkRange("link").unsetLink().run();
            return;
          }
          const url = safeUrl(input, true);
          if (!url) {
            window.alert("Ungültige Adresse. Erlaubt sind https://…, mailto:… oder interne Pfade (/…).");
            return;
          }
          chain().extendMarkRange("link").setLink({ href: url }).run();
        }}
      />
      <ToolButton
        icon={ImagePlus}
        label="Bild per URL einfügen"
        disabled={dis}
        onClick={() => {
          const url = safeUrl(window.prompt("Bild-URL (https://… oder /uploads/…):"), true);
          if (!url) return;
          const alt = window.prompt("Alternativtext (Bildbeschreibung):") ?? "";
          chain().setImage({ src: url, alt }).run();
        }}
      />
      <span className="mx-1 h-6 w-px bg-border" aria-hidden />
      <ToolButton icon={Undo2} label="Rückgängig" disabled={dis || !s?.canUndo} onClick={() => chain().undo().run()} />
      <ToolButton icon={Redo2} label="Wiederholen" disabled={dis || !s?.canRedo} onClick={() => chain().redo().run()} />
      <span className="ml-auto" />
      <button
        type="button"
        onClick={onToggleSource}
        aria-pressed={source}
        disabled={!editor}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold ${
          source ? "bg-brand text-white dark:text-[#04201e]" : "text-fg hover:bg-bg-soft"
        }`}
      >
        <Code2 className="size-4" aria-hidden /> HTML
      </button>
    </div>
  );
}

/** TipTap-Editor mit HTML-Quelltextmodus. Schreibt das HTML in ein verstecktes Feld `name`. */
export function RichEditor({ name, initialHtml = "", id = name, label = "Inhalt", onChange }: Props) {
  const [html, setHtml] = useState(initialHtml);
  const [source, setSource] = useState(false);
  const [sourceText, setSourceText] = useState(initialHtml);

  const update = (v: string) => {
    setHtml(v);
    onChange?.(v);
  };

  const editorRef = useRef<Editor | null>(null);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: null, target: null } },
      }),
      Image.configure({ inline: false }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        id,
        "aria-label": label,
        "aria-multiline": "true",
        role: "textbox",
        class: "prose-fp min-h-72 max-w-none px-4 py-3 focus:outline-none",
      },
      // Eingefügter Text mit URLs (z. B. Quellenlisten): Links gekürzt anzeigen, Zeilen erhalten
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain") ?? "";
        const htmlData = event.clipboardData?.getData("text/html") ?? "";
        if (!/https?:\/\//i.test(text + htmlData)) return false;
        const content = htmlData
          ? autolinkUrls(htmlData)
          : text
              .split(/\r?\n\s*\r?\n/)
              .map((para) => `<p>${autolinkUrls(escapeText(para))}</p>`)
              .join("");
        editorRef.current?.commands.insertContent(content);
        return true;
      },
    },
    onUpdate: ({ editor: e }) => update(e.isEmpty ? "" : e.getHTML()),
  });
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const toggleSource = () => {
    if (!editor) return;
    if (!source) {
      setSourceText(html);
      setSource(true);
    } else {
      editor.commands.setContent(autolinkUrls(sourceText), { emitUpdate: false });
      update(editor.isEmpty ? "" : editor.getHTML());
      setSource(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface focus-within:border-brand">
      <Toolbar editor={editor} source={source} onToggleSource={toggleSource} />
      {source ? (
        <textarea
          id={`${id}-source`}
          aria-label={`${label} (HTML-Quelltext)`}
          value={sourceText}
          onChange={(e) => {
            setSourceText(e.target.value);
            update(e.target.value);
          }}
          spellCheck={false}
          className="block min-h-72 w-full resize-y bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-fg focus:outline-none"
        />
      ) : (
        <>
          {!editor && <div className="min-h-72 px-4 py-3 text-sm text-muted">Editor wird geladen …</div>}
          <EditorContent editor={editor} />
        </>
      )}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
