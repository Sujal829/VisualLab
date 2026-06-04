import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const GradientMetric = () => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        labels: ['12:00', '12:05', '12:10', '12:15', '12:20', '12:25'],
        datasets: [],
    });

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        // 1. Create the Gradient
        const ctx = chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)'); // Indigo top
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');   // Transparent bottom

        setChartData({
            labels: ['12:00', '12:05', '12:10', '12:15', '12:20', '12:25'],
            datasets: [
                {
                    label: 'Latency (ms)',
                    data: [40, 55, 45, 90, 65, 50],
                    fill: true,
                    backgroundColor: gradient, // Use the gradient here
                    borderColor: '#6366f1',
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                },
            ],
        });
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            // 2. Custom Plugin for a "Danger Zone" threshold line
            autocolors: false,
            annotation: { /* Requires extra plugin, or draw manually below */ }
        },
        scales: {
            y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false } }
        }
    };

    // 3. Simple custom plugin to draw a horizontal "Limit" line
    const thresholdLine = {
        id: 'thresholdLine',
        beforeDraw(chart) {
            const { ctx, chartArea: { right, left }, scales: { y } } = chart;
            ctx.save();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'; // Red color
            ctx.setLineDash([5, 5]); // Dashed line
            ctx.lineWidth = 2;
            const yValue = y.getPixelForValue(80); // Draw at 80ms
            ctx.beginPath();
            ctx.moveTo(left, yValue);
            ctx.lineTo(right, yValue);
            ctx.stroke();
            ctx.restore();
        }
    };

    return (
        <div className="p-8 bg-[#0b0f1a] rounded-3xl border border-white/10 w-full max-w-2xl">
            <h2 className="text-white font-bold mb-4">Network Latency (with Threshold)</h2>
            <div className="h-64">
                <LinePick your
                    Workspace
                    ref={chartRef}
                    data={chartData}
                    options={options}
                    plugins={[thresholdLine]}
                />
            </div>
        </div>
    );
};

export default GradientMetric;