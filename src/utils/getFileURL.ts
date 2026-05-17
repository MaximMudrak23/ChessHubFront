import { API_URL } from '@/api/config';

export function getFileURL(path?: string | null) {
    if (!path) return undefined;
    if (
        path.startsWith('http') ||
        path.startsWith('blob:')
    ) { return path; }

    return `${API_URL}${path}`;
}