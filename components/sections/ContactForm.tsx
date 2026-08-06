"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { submitContactForm } from "@/app/actions/submit-contact-form";
import {
  IconUser,
  IconMail,
  IconMessage,
  IconSend,
  IconLoader2,
  IconCheck,
  IconAlertCircle,
  IconPencil,
} from "@tabler/icons-react";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitContactForm(formData);

      if (result.success) {
        setStatus("success");
        e.currentTarget.reset();
        timerRef.current = setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Something went wrong");
      }
    });
  };

  return (
    <section 
      id="contact" 
      aria-labelledby="contact-heading"
      className="w-full relative group/form"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 shadow-xl shadow-zinc-200/50 dark:shadow-black/50 transition-all duration-500">
        {/* Decorative Gradient - Hidden from A11y */}
        <div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-20" 
            aria-hidden="true"
        />

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h2 
                id="contact-heading" 
                className="text-2xl font-bold tracking-tight text-foreground"
            >
              Get in Touch
            </h2>
            <p className="text-sm text-muted-foreground">
              Let’s turn your idea into reality.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup>
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <InputIcon icon={<IconUser className="w-5 h-5" />} />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    disabled={isPending}
                    autoComplete="name"
                  />
                </div>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <InputIcon icon={<IconMail className="w-5 h-5" />} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    disabled={isPending}
                    autoComplete="email"
                  />
                </div>
              </InputGroup>
            </div>

            <InputGroup>
              <Label htmlFor="subject">Subject</Label>
              <div className="relative">
                <InputIcon icon={<IconPencil className="w-5 h-5" />} />
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Project proposal"
                  disabled={isPending}
                />
              </div>
            </InputGroup>

            <InputGroup>
              <Label htmlFor="message">Message</Label>
              <div className="relative">
                <div 
                    className="absolute left-3.5 top-3.5 text-muted-foreground/40 group-focus-within:text-[var(--color-primary)] transition-colors"
                    aria-hidden="true"
                >
                  <IconMessage className="w-5 h-5" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  disabled={isPending}
                  placeholder="Tell me about your project..."
                  required
                  className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-white/5 border border-transparent rounded-xl text-sm outline-none resize-none placeholder:text-muted-foreground/40 focus:bg-background focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/10 disabled:opacity-50 transition-all duration-300 leading-relaxed"
                />
              </div>
            </InputGroup>

            {/* LIVE REGION: Announces errors/status to screen readers immediately */}
            <div className="min-h-[20px]" aria-live="polite" aria-atomic="true">
              {status === "error" && (
                <div 
                    className="flex items-center gap-2 text-xs font-medium text-red-500 animate-in slide-in-from-left-2 fade-in"
                    role="alert"
                >
                  <IconAlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errorMsg}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending || status === "success"}
              aria-disabled={isPending || status === "success"}
              className={`relative w-full h-14 rounded-xl font-bold text-sm tracking-wide overflow-hidden transition-all duration-300 ${
                status === "success"
                  ? "bg-emerald-500 text-white cursor-default"
                  : "bg-foreground text-background dark:bg-white dark:text-black hover:opacity-90 active:scale-[0.99]"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <IconLoader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    <span>Processing...</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <IconCheck className="w-5 h-5 animate-in zoom-in spin-in-90 duration-300" aria-hidden="true" />
                    <span className="animate-in fade-in">
                      Sent successfully
                    </span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <IconSend className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- Sub Components ---------- */

function InputGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5 group">{children}</div>;
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 group-focus-within:text-[var(--color-primary)] transition-colors ml-1"
    >
      {children}
    </label>
  );
}

function InputIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-[var(--color-primary)] transition-colors"
        aria-hidden="true"
    >
      {icon}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      required
      className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-white/5 border border-transparent rounded-xl text-sm outline-none placeholder:text-muted-foreground/40 focus:bg-background focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/10 disabled:opacity-50 transition-all duration-300"
    />
  );
}