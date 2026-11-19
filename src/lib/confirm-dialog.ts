/**
 * The app's own confirmation / message window (owner 19 Nov 2026). The browser's confirm() / alert()
 * count towards iPad browsers' "prevent this page from creating additional alerts" question; these don't.
 * <ConfirmHost /> is mounted once in main.tsx; anywhere: `if (!(await confirmDialog({...}))) return;`.
 */
export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button (delete, reset, discard …). */
  danger?: boolean;
  /** Only an OK button (replaces alert()). */
  alertOnly?: boolean;
};

export type PendingConfirm = ConfirmOptions & { resolve: (ok: boolean) => void };

let show: ((p: PendingConfirm) => void) | null = null;

export function registerConfirmHost(fn: ((p: PendingConfirm) => void) | null) {
  show = fn;
}

export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (!show) {
      resolve(window.confirm([options.title, options.description].filter(Boolean).join("\n\n")));
      return;
    }
    show({ ...options, resolve });
  });
}

export async function alertDialog(title: string, description?: string): Promise<void> {
  await confirmDialog({ title, description, alertOnly: true, confirmLabel: "OK" });
}

const ACTIONS: [RegExp, string, boolean][] = [
  [/^delete\b/i, "Delete", true],
  [/^remove\b/i, "Remove", true],
  [/^reset\b/i, "Reset", true],
  [/^clear\b/i, "Clear", true],
  [/^switch\b/i, "Switch", false],
  [/^leave this document/i, "Leave", true],
  [/^go back/i, "Go back", true],
];

/**
 * A browser-style one-line question as an in-app window: the first sentence becomes the title, the rest
 * the description; the button says what it does (Delete, Reset, Go back …), red when it loses work.
 */
export function ask(message: string): Promise<boolean> {
  const m = message.match(/^(.+?[?.])\s+(.+)$/s);
  const title = (m ? m[1] : message).trim();
  const description = m ? m[2].trim() : undefined;
  const hit = ACTIONS.find(([re]) => re.test(title) || re.test(description ?? ""));
  return confirmDialog({ title, description, confirmLabel: hit?.[1] ?? "OK", danger: hit?.[2] ?? false });
}
