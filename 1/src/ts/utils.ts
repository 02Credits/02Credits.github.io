export function defaultValue<T>(getX: () => T, defaultValue: T) {
    try {
        let x = getX();
        if (x != null) {
            return x;
        } else {
            return defaultValue;
        }
    } catch (e) {
        return defaultValue;
    }
}
