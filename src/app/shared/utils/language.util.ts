export function getStoredLanguage(): string {
  return localStorage.getItem("app-lang") || localStorage.getItem("lang") || "ar";
}

export function isRtlLanguage(): boolean {
  return getStoredLanguage() !== "en";
}
