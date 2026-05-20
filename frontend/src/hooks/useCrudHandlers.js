import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../utils/errorUtils";
import { parseValidationErrors } from "../utils/validationErrors";

/** Shared API error + toast helpers for CRUD pages */
export function useCrudHandlers() {
    const toast = useToast();

    const handleError = (err, setFieldErrors, setError) => {
        const fields = parseValidationErrors(err);
        if (Object.keys(fields).length > 0) {
            setFieldErrors(fields);
            return;
        }
        const msg = getErrorMessage(err);
        if (setError) setError(msg);
        else toast.error(msg);
    };

    return { toast, handleError };
}
