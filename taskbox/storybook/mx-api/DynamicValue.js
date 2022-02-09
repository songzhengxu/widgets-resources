export function dynamicValue(value, loading) {
    if (loading) {
        return { status: "loading", value };
    }
    return value !== undefined ? { status: "available", value } : { status: "unavailable", value: undefined };
}
