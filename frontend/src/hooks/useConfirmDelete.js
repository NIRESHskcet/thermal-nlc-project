import { useCallback, useState } from "react";

/**
 * Reusable confirm-delete modal state (replaces window.confirm).
 */
export function useConfirmDelete() {
    const [state, setState] = useState({
        open: false,
        title: "Confirm delete",
        message: "",
        onConfirm: null,
    });

    const requestDelete = useCallback(({ title, message, onConfirm }) => {
        setState({
            open: true,
            title: title || "Confirm delete",
            message: message || "This action cannot be undone.",
            onConfirm,
        });
    }, []);

    const close = useCallback(() => {
        setState((s) => ({ ...s, open: false, onConfirm: null }));
    }, []);

    const confirm = useCallback(async () => {
        if (state.onConfirm) {
            await state.onConfirm();
        }
        close();
    }, [state.onConfirm, close]);

    return { confirmState: state, requestDelete, close, confirm };
}
