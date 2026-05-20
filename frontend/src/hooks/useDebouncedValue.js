import { useEffect, useState } from "react";

/**
 * Debounces fast-changing values (e.g. search input) to reduce API calls.
 */
export function useDebouncedValue(value, delayMs = 350) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs]);

    return debounced;
}
