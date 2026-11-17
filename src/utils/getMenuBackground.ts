import { BACKGROUNDS } from '@/constants/paths';

export function getMenuBackground(value?: string | null) {
    return Object.entries(BACKGROUNDS).find(([id, background]) => (
        value === id || value === background.url || background.url === `/backgrounds/${value}`
    ))?.[1] ?? BACKGROUNDS.default;
}
