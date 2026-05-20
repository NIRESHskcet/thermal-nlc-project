function FieldError({ error }) {
    if (!error) return null;
    return <div className="invalid-feedback d-block">{error}</div>;
}

export default FieldError;
