export function setTheme(themeName: string): void {
    document.documentElement.setAttribute('data-theme', themeName);
}