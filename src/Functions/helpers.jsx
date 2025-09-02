export function capitalizeName(name) {
    if (!name) return "";
    return name
        .split(" ") // separar por espacios
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" "); // unir de nuevo
}