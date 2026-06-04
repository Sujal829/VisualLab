import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronLeft, Activity, Zap, ShieldCheck, BarChart3,
    Share2, Target, Cpu, Download
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

// Register ChartJS once at the module level
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Filler,
    Legend
);

const Metrics = () => {
    // --- STATE MANAGEMENT ---
    // Using lazy initialization for stability and to follow purity rules
    const [lineData] = useState(() => ({
        labels: ['12:00', '12:05', '12:10', '12:15', '12:20', '12:25'],
        datasets: [{
            fill: true,
            label: 'Node Latency',
            data: [45, 52, 48, 70, 65, 58],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
        }]
    }));

    const [scatterData] = useState(() => ({
        datasets: [{
            label: 'Load Correlation',
            data: Array.from({ length: 10 }, () => ({
                x: Math.floor(Math.random() * 100),
                y: Math.floor(Math.random() * 100)
            })),
            backgroundColor: '#ec4899',
        }]
    }));

    // --- CHART OPTIONS CONFIG ---
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
        }
    };

    const radialOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                angleLines: { color: 'rgba(255,255,255,0.05)' },
                pointLabels: { color: '#64748b', font: { size: 10 } },
                ticks: { display: false }
            }
        },
        plugins: { legend: { display: false } }
    };

    // 1. Create a single registry to hold all chart instances
    const chartRefs = useRef({});

    // 2. Helper to register the chart instance
    const registerChart = (name) => (el) => {
        if (el) chartRefs.current[name] = el;
    };

    // --- UPDATED EXPORT FUNCTIONS ---
    // Now they take a "key" string instead of a direct ref
    const exportToPDF = (key, title) => {
        const chartInstance = chartRefs.current[key];
        if (!chartInstance) return;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const chartData = chartInstance.data;
        const now = new Date().toLocaleString();

        // 1. BRANDED HEADER & METADATA
        pdf.setFontSize(20);
        pdf.setTextColor(99, 102, 241); // Indigo color
        pdf.text(title.toUpperCase(), 15, 20);

        pdf.setFontSize(9);
        pdf.setTextColor(100, 116, 139); // Slate color
        pdf.text(`Generated: ${now}`, 15, 27);
        pdf.text(`System Telemetry v2.0`, 160, 27);
        pdf.line(15, 30, 195, 30); // Divider line

        // 2. CHART IMAGE
        const base64Image = chartInstance.toBase64Image();
        pdf.addImage(base64Image, 'PNG', 15, 35, 180, 80);

        // 3. STATISTICAL SUMMARY (The "Add-on")
        // We calculate these dynamically from the first dataset
        const values = chartData.datasets[0].data.filter(v => typeof v === 'number');
        const max = values.length > 0 ? Math.max(...values) : 0;
        const min = values.length > 0 ? Math.min(...values) : 0;
        const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : 0;

        autoTable(pdf, {
            startY: 120,
            head: [['Metric Summary', 'Value']],
            body: [
                ['Peak Recorded Value', `${max}`],
                ['Minimum Recorded Value', `${min}`],
                ['Average Performance', `${avg}`],
            ],
            theme: 'grid',
            headStyles: { fillColor: [51, 65, 85] }, // Darker Slate
            columnStyles: { 0: { fontStyle: 'bold', width: 50 } },
            margin: { left: 15 },
            tableWidth: 80,
        });

        // 4. FULL DATA TABLE
        const tableHeaders = [['Label', ...chartData.datasets.map(ds => ds.label || 'Value')]];
        const tableRows = chartData.labels.map((label, index) => {
            const rowData = [label];
            chartData.datasets.forEach(dataset => rowData.push(dataset.data[index]));
            return rowData;
        });

        autoTable(pdf, {
            startY: 155,
            head: tableHeaders,
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [99, 102, 241] },
            styles: { fontSize: 9 },
        });

        // 5. FOOTER (Page Numbers)
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.text(`Confidential - Internal Use Only | Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        }

        pdf.save(`${title.toLowerCase().replace(/\s/g, '-')}.pdf`);
    };

    const exportToExcel = async (key, title) => {
        const chartInstance = chartRefs.current[key];
        if (!chartInstance) return;

        const chartData = chartInstance.data;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        worksheet.getRow(1).values = [title];
        worksheet.getRow(1).font = { bold: true, size: 14 };

        // Headers: Handling multiple datasets (like Inbound/Outbound)
        const headers = ['Category', ...chartData.datasets.map(ds => ds.label)];
        worksheet.getRow(3).values = headers;
        worksheet.getRow(3).font = { bold: true };

        chartData.labels.forEach((label, index) => {
            const row = [label];
            chartData.datasets.forEach(ds => row.push(ds.data[index]));
            worksheet.addRow(row);
        });

        const imageId = workbook.addImage({
            base64: chartInstance.toBase64Image(),
            extension: 'png',
        });
        worksheet.addImage(imageId, 'F3:M20');

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${title}.xlsx`);
    };
    return (
        <div className="min-h-screen bg-[#02040a] text-slate-300 p-6 md:p-10 font-sans selection:bg-indigo-500/30">

            {/* HEADER */}
            <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div className="flex items-center gap-5">
                    <Link to="/" className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                        <ChevronLeft size={20} className="text-white" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">System Telemetry</h1>
                        <p className="text-xs text-slate-500 font-medium">Real-time node performance monitoring</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <StatMini icon={<Activity size={14} />} label="Status" value="Optimal" color="text-emerald-400" />
                    {/* <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-all">
                        <Download size={14} /> EXPORT
                    </button> */}
                </div>
            </header>

            {/* DASHBOARD GRID */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <ChartContainer title="Throughput" icon={<Activity size={18} className="text-indigo-500" />}
                    onPdf={() => exportToPDF("LineRef", "Throughput Report")}
                    onExcel={() => exportToExcel("LineRef", "Throughput Data")} >
                    <Line ref={registerChart('LineRef')} data={lineData} options={commonOptions} />
                </ChartContainer>

                <ChartContainer title="Traffic Distribution" icon={<BarChart3 size={18} className="text-pink-500" />}
                    onPdf={() => exportToPDF("barRef", "Throughput Report")}
                    onExcel={() => exportToExcel("barRef", "Throughput Data")} >
                    <Bar
                        ref={registerChart('barRef')}
                        data={{
                            labels: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'],
                            datasets: [{ label: 'GB', data: [65, 45, 75, 50, 80], backgroundColor: 'rgb(99, 102, 241)', borderRadius: 6 }]
                        }}
                        options={commonOptions}
                    />
                </ChartContainer>

                <ChartContainer title="System Integrity" icon={<Target size={18} className="text-emerald-500" />
                }
                    onPdf={() => exportToPDF("RadarRef", "Throughput Report")}
                    onExcel={() => exportToExcel("RadarRef", "Throughput Data")} >

                    <Radar
                        ref={registerChart('RadarRef')}
                        data={{
                            labels: ['Speed', 'Stability', 'Security', 'Capacity', 'Uptime'],
                            datasets: [{ label: 'Health', data: [80, 90, 70, 85, 95], backgroundColor: 'rgba(99, 102, 241, 0.2)', borderColor: '#6366f1', pointBackgroundColor: '#6366f1' }]
                        }}
                        options={radialOptions}
                    />
                </ChartContainer>

                <ChartContainer title="System Integrity" icon={<Target size={18} className="text-emerald-500" />}
                    onPdf={() => exportToPDF("Line2Ref", "Throughput Report")}
                    onExcel={() => exportToExcel("Line2Ref", "Throughput Data")}
                >
                    <Line
                        ref={registerChart('Line2Ref')}
                        data={{
                            labels: ['Speed', 'Stability', 'Security', 'Capacity', 'Uptime'],
                            datasets: [{ label: 'Health', data: [80, 90, 70, 85, 95], backgroundColor: '#f59e0b', borderColor: '#f59e0b', pointBackgroundColor: '#f59e0b' }]
                        }}
                        options={radialOptions}
                    />
                </ChartContainer>

                <ChartContainer title="Resource Allocation" icon={<Cpu size={18} className="text-amber-500" />}
                    onPdf={() => exportToPDF("DoughnutRef", "Throughput Report")}
                    onExcel={() => exportToExcel("DoughnutRef", "Throughput Data")}>
                    <Doughnut
                        ref={registerChart('DoughnutRef')}
                        data={{
                            labels: ['CPU', 'Mem', 'Disk', 'Net'],
                            datasets: [{ data: [30, 25, 20, 25], backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981'], borderWidth: 0 }]
                        }}
                        options={{ ...commonOptions, cutout: '75%', scales: {} }}
                    />
                </ChartContainer>

                <ChartContainer title="Load Correlation" icon={<Activity size={18} className="text-orange-500" />}
                    onPdf={() => exportToPDF("ScatterRef", "Throughput Report")}
                    onExcel={() => exportToExcel("ScatterRef", "Throughput Data")}
                >
                    <Scatter
                        ref={registerChart('ScatterRef')}
                        data={scatterData} options={commonOptions} />
                </ChartContainer>
                <ChartContainer title="Network Comparison" icon={<BarChart3 size={18} className="text-cyan-400" />}
                    onPdf={() => exportToPDF("Bar2Ref", "Throughput Report")}
                    onExcel={() => exportToExcel("Bar2Ref", "Throughput Data")}
                >
                    <Bar
                        ref={registerChart('Bar2Ref')}
                        data={{
                            labels: ['Node A', 'Node B', 'Node C', 'Node D'],
                            datasets: [
                                {
                                    label: 'Inbound',
                                    data: [45, 59, 80, 51],
                                    backgroundColor: '#6366f1', // Indigo
                                    borderRadius: 4,
                                    barPercentage: 0.8, // Controls width of individual bars
                                    categoryPercentage: 0.6, // Controls spacing between groups
                                },
                                {
                                    label: 'Outbound',
                                    data: [28, 48, 40, 19],
                                    backgroundColor: '#ec4899', // Pink
                                    borderRadius: 4,
                                    barPercentage: 0.8,
                                    categoryPercentage: 0.6,
                                }
                            ]
                        }}
                        options={{
                            ...commonOptions,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                    align: 'end',
                                    labels: {
                                        boxWidth: 6,
                                        usePointStyle: true,
                                        pointStyle: 'circle',
                                        color: '#94a3b8',
                                        font: { size: 10, weight: 'bold' }
                                    }
                                },
                                tooltip: {
                                    backgroundColor: '#1e293b',
                                    titleColor: '#fff',
                                    bodyColor: '#cbd5e1',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderWidth: 1,
                                }
                            },
                            scales: {
                                x: {
                                    stacked: false, // Ensure this is false for grouping
                                    grid: { display: false },
                                    ticks: { color: '#64748b', font: { size: 10 } }
                                },
                                y: {
                                    stacked: false, // Ensure this is false for grouping
                                    grid: { color: 'rgba(255,255,255,0.05)' },
                                    ticks: { color: '#64748b', font: { size: 10 } }
                                }
                            }
                        }}
                    />
                </ChartContainer>

                <ChartContainer title="Performance Profile" icon={<Target size={18} className="text-purple-500" />}
                    onPdf={() => exportToPDF('radarRef', "Throughput Report")}
                    onExcel={() => exportToExcel('radarRef', "Throughput Data")}
                >
                    <Radar
                        ref={registerChart('radarRef')}
                        data={{
                            labels: ['Latency', 'Uptime', 'Security', 'Throughput', 'Balance', 'Memory'],
                            datasets: [
                                {
                                    label: 'Current',
                                    data: [85, 98, 70, 91, 65, 80],
                                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                    borderColor: '#6366f1',
                                    pointBackgroundColor: '#6366f1',
                                    pointBorderColor: '#fff',
                                    borderWidth: 2,
                                },
                                {
                                    label: 'Baseline',
                                    data: [70, 85, 80, 75, 70, 75],
                                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                    borderColor: 'rgba(236, 72, 153, 0.5)',
                                    pointBackgroundColor: '#ec4899',
                                    borderDash: [5, 5],
                                    borderWidth: 1,
                                }
                            ]
                        }}
                        options={radialOptions}
                    />
                </ChartContainer>
                <ChartContainer
                    title="Throughput"
                    icon={<Activity size={18} className="text-indigo-500" />}
                    onPdf={() => exportToPDF('throughputRef', "Throughput Report")}
                    onExcel={() => exportToExcel('throughputRef', "Throughput Data")}
                >
                    <Line ref={registerChart('throughputRef')} data={lineData} options={commonOptions} />
                </ChartContainer>

                {/* PROMO / STATUS CARD */}
                <section className="p-8 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <ShieldCheck size={160} />
                    </div>
                    <ShieldCheck className="text-indigo-400 mb-4" size={40} />
                    <h3 className="text-white font-bold text-xl">All Systems Go</h3>
                    <p className="text-sm text-indigo-300/60 mt-2 leading-relaxed">
                        Security protocols active across all nodes. No anomalies detected in the last 24h.
                    </p>
                </section>

            </main>
        </div>
    );
};

// --- STANDARDIZED SUB-COMPONENTS ---

const ChartContainer = ({ title, icon, children, onPdf, onExcel }) => (
    <section className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm flex flex-col h-96 hover:border-white/10 transition-colors group">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    {icon}
                </div>
                <h3 className="font-bold text-white text-[10px] uppercase tracking-[0.2em]">{title}</h3>
            </div>

            {/* DOWNLOAD ACTIONS */}
            {(onPdf || onExcel) && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onPdf}
                        className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
                        title="Download PDF"
                    >
                        <Download size={14} />
                    </button>
                    <button
                        onClick={onExcel}
                        className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
                        title="Download Excel"
                    >
                        <Share2 size={14} />
                    </button>
                </div>
            )}
        </div>
        <div className="flex-1 min-h-0">
            {children}
        </div>
    </section>
);

const StatMini = ({ icon, label, value, color }) => (
    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
        <div className={`${color} bg-current/10 p-1.5 rounded-lg`}>{icon}</div>
        <div>
            <p className="text-[9px] font-bold uppercase text-slate-500 leading-none mb-1">{label}</p>
            <p className={`text-xs font-black leading-none ${color}`}>{value}</p>
        </div>
    </div>
);

export default Metrics;