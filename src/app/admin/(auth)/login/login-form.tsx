"use client";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { btnPrimary, inputCls, labelCls } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null);
  return (
    <form action={action} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className={labelCls}>
          E-Mail-Adresse
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state?.email ?? ""}
          key={state?.at ?? "init"}
          className={inputCls}
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "login-error" : undefined}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelCls}>
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputCls}
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "login-error" : undefined}
        />
      </div>
      <div aria-live="assertive" role="alert" className="empty:hidden">
        {state?.error && (
          <p id="login-error" className="flex items-start gap-2 rounded-xl bg-bad-soft px-3.5 py-2.5 text-sm font-medium text-bad">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {state.error}
          </p>
        )}
      </div>
      <button type="submit" className={`${btnPrimary} w-full`} disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <LogIn className="size-4" aria-hidden />}
        {pending ? "Anmeldung läuft …" : "Anmelden"}
      </button>
    </form>
  );
}
