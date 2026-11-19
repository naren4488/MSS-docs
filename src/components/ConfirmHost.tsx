import { useEffect, useRef, useState } from "react";

import { registerConfirmHost, type PendingConfirm } from "@/lib/confirm-dialog";

/** Renders confirmDialog() / alertDialog() windows (one at a time; a new one answers the old as Cancel). */
export function ConfirmHost() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerConfirmHost((next) =>
      setPending((current) => {
        current?.resolve(false);
        return next;
      }),
    );
    return () => registerConfirmHost(null);
  }, []);

  useEffect(() => {
    if (!pending) return;
    okRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") answer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function answer(ok: boolean) {
    pending?.resolve(ok);
    setPending(null);
  }

  if (!pending) return null;
  return (
    <div className="dialog-overlay no-print" role="presentation" onClick={() => answer(false)} data-testid="confirm-dialog">
      <div
        className="dialog-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" style={{ marginTop: 0, fontSize: "1.15rem" }}>
          {pending.title}
        </h2>
        {pending.description ? <p className="muted-text">{pending.description}</p> : null}
        <div className="dialog-actions">
          {pending.alertOnly ? null : (
            <button className="ghost-button" type="button" onClick={() => answer(false)} data-testid="confirm-dialog-cancel">
              {pending.cancelLabel ?? "Cancel"}
            </button>
          )}
          <button
            ref={okRef}
            className={pending.danger ? "danger-button" : "primary-button"}
            type="button"
            onClick={() => answer(true)}
            data-testid="confirm-dialog-ok"
          >
            {pending.confirmLabel ?? "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
