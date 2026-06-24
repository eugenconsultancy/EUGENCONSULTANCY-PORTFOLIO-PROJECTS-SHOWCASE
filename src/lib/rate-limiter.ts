type IpRecord = {
    timestamps: number[];
};

const map = new Map<string, IpRecord>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(
    ip: string,
    maxRequests: number
): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = map.get(ip) || { timestamps: [] };

    // Filter out timestamps outside the window
    record.timestamps = record.timestamps.filter(
        (ts) => now - ts < WINDOW_MS
    );

    const count = record.timestamps.length;

    if (count >= maxRequests) {
        map.set(ip, record); // update the map
        return { allowed: false, remaining: 0 };
    }

    record.timestamps.push(now);
    map.set(ip, record);
    return { allowed: true, remaining: maxRequests - record.timestamps.length };
}