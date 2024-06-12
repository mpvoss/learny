
export function getEnv(key: string): string | undefined {
    return import.meta.env[key];
}