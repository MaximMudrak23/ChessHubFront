import { getRegisterStatus } from '@/api/authApi';

export function pollRegisterStatus(email: string, onVerified: () => void) {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    async function checkStatus() {
        try {
            const { verified } = await getRegisterStatus(email);

            if (!active) return;

            if (verified) {
                active = false;
                onVerified();
                return;
            }
        } catch (error) {
            console.log(error);
        }

        if (active) timer = setTimeout(checkStatus, 3000);
    }

    timer = setTimeout(checkStatus, 3000);

    return () => {
        active = false;
        clearTimeout(timer);
    };
}
