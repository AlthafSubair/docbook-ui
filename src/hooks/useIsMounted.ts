import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hydration-safe hook that returns true once the component has mounted on the client.
 * Uses React 19's `useSyncExternalStore` to guarantee that the server and initial client
 * hydration passes match identically, preventing SSR hydration mismatches.
 *
 * @returns {boolean} true on the client after hydration, false during SSR and initial hydration.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // Client snapshot
    () => false  // Server snapshot
  );
}

