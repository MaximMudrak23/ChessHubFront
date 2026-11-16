import { getSocketSessionVersion, socket } from './socket';

export const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);

type Options<T> = {
    event: string;
    onUpdate: (data: T) => void;
    loadSnapshot: () => Promise<T>;
    join?: () => void;
    leave?: () => void;
    accepts?: (data: T) => boolean;
    getSnapshotVersion?: () => number;
    canApplySnapshot?: () => boolean;
};

export function subscribeToSocketState<T>(options: Options<T>) {
    const session = getSocketSessionVersion();
    let active = true;
    let version = 0;
    const isCurrent = () => active && session === getSocketSessionVersion();

    function handleUpdate(data: T) {
        if (!isCurrent() || (options.accepts && !options.accepts(data))) return;
        version += 1;
        options.onUpdate(data);
    }

    async function synchronize() {
        const requestVersion = ++version;
        const snapshotVersion = options.getSnapshotVersion?.();
        try {
            const data = await options.loadSnapshot();
            if (!isCurrent() || requestVersion !== version) return;
            if (snapshotVersion !== options.getSnapshotVersion?.()) return;
            if (options.canApplySnapshot && !options.canApplySnapshot()) return;
            handleUpdate(data);
        } catch (error) {
            if (isCurrent() && requestVersion === version) console.log(error);
        }
    }

    function handleConnect() {
        if (!isCurrent()) return;
        options.join?.();
        void synchronize();
    }

    function handleDisconnect() {
        version += 1;
    }

    socket.on(options.event, handleUpdate);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (socket.connected) handleConnect();
    else void synchronize();

    return () => {
        if (socket.connected && isCurrent()) options.leave?.();
        active = false;
        version += 1;
        socket.off(options.event, handleUpdate);
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
    };
}
