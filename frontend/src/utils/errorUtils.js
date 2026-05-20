/**
 * Normalizes Axios / API errors into a user-readable string.
 * Handles plain text, validation maps, and generic network failures.
 */
export const getErrorMessage = (err) => {
    if (!err) {
        return "Something went wrong";
    }

    const data = err.response?.data;
    if (data) {
        if (typeof data === "string") {
            return data;
        }
        if (typeof data === "object") {
            const values = Object.values(data);
            if (values.length > 0) {
                return values.join(", ");
            }
        }
    }

    return err.message || "Something went wrong";
};
