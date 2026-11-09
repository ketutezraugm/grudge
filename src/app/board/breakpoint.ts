import { useSyncExternalStore } from "react";

/** Wide screens (1200 and up), tablets (600 to 1199) and phones draw different markup. */
export type Layout = "desk" | "tab" | "phone";

const DESK = "(min-width: 1200px)";
const TAB = "(min-width: 600px)";

function subscribe(notify: () => void) {
  const lists = [DESK, TAB].map((query) => window.matchMedia(query));
  for (const list of lists) list.addEventListener("change", notify);
  return () => {
    for (const list of lists) list.removeEventListener("change", notify);
  };
}

function current(): Layout {
  if (window.matchMedia(DESK).matches) return "desk";
  return window.matchMedia(TAB).matches ? "tab" : "phone";
}

/** Read in the browser only: the server cannot know the width, so it gets null and renders nothing. */
export const useLayout = (): Layout | null => useSyncExternalStore(subscribe, current, () => null);
