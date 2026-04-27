import { useEffect, useState } from "react";

const STORAGE_KEY = "qoribex_app_onboarding_hidden";

export function useAppOnboarding() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem(STORAGE_KEY);
    setOpen(hidden !== "true");
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setOpen(true);
  };

  return {
    open,
    close,
    reset,
  };
}