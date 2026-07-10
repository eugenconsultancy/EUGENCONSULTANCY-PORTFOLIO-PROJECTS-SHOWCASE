"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

type Series = {
    title: string;
    data: { month: string; views: number }[];
};

export function ComparisonLineChart({ series }: { series: Series[] }) {
    const mergedData: Record<string, Record<string, number>> = {};
    series.forEach((s) => {
        s.data.forEach((d) => {
            if (!mergedData[d.month]) mergedData[d.month] = {};
            mergedData[d.month][s.title] = d.views;
        });
    });
    const chartData = Object.entries(mergedData)
        .map(([month, values]) => ({ month, ...values }))
        .sort((a, b) => (a.month > b.month ? 1 : -1));

    return (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Top Projects – Views Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    {series.map((s, idx) => (
                        <Line
                            key={s.title}
                            type="monotone"
                            dataKey={s.title}
                            stroke={COLORS[idx % COLORS.length]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}