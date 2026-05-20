/**
 * Parses Spring validation Map responses into { fieldName: message }.
 */
export function parseValidationErrors(err) {
    const data = err?.response?.data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
        const keys = Object.keys(data);
        if (keys.length > 0 && typeof data[keys[0]] === "string") {
            return data;
        }
    }
    return {};
}

export function getFieldError(fieldErrors, fieldName) {
    if (!fieldErrors) return "";
    return fieldErrors[fieldName] || fieldErrors[fieldName?.split(".")?.pop()] || "";
}
