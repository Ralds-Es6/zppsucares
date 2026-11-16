import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { BarChart3, PieChart as PieChartIcon, Calendar, Loader2 } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface MonthlyReportTrend {
    month: string;
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
    Resolved: number;
    Pending: number;
    Reviewed: number;
    Total: number;
}

interface MonthlyAppointmentTrend {
    month: string;
    Approved: number;
    Pending: number;
    Rejected: number;
    Completed: number;
    Total: number;
}

interface MonthlyCaseTrend {
    month: string;
    Physical: number;
    Mental: number;
    Other: number;
    Total: number;
}

interface TrendsResponse {
    year: number;
    reportsMonthly: MonthlyReportTrend[];
    appointmentsMonthly: MonthlyAppointmentTrend[];
    casesMonthly: MonthlyCaseTrend[];
}

export interface VulnerabilityStats {
    totalStudents?: number;
    physicallyDisabled?: number;
    mentalHealthConcerns?: number;
    otherConcerns?: number;
    healthy?: number;
}

interface AnalyticsChartsProps {
    stats: VulnerabilityStats;
    token?: string;
}

type BarMetric = 'reports' | 'appointments' | 'cases';
type PieMode = 'doughnut' | 'pie';

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ stats, token }) => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [barMetric, setBarMetric] = useState<BarMetric>('reports');
    const [pieMode, setPieMode] = useState<PieMode>('doughnut');
    const [trends, setTrends] = useState<TrendsResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }
        let cancelled = false;
        const fetchTrends = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get<TrendsResponse>(`/api/stats/trends?year=${selectedYear}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!cancelled) {
                    setTrends(data);
                }
            } catch (error) {
                console.error('Failed to fetch analytics trends:', error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };
        fetchTrends();
        return () => {
            cancelled = true;
        };
    }, [selectedYear, token]);

    // ── Bar Chart Data ──
    const labels = trends?.reportsMonthly.map((m) => m.month) || [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const getBarData = () => {
        if (barMetric === 'appointments') {
            return {
                labels,
                datasets: [
                    {
                        label: 'Approved',
                        data: trends?.appointmentsMonthly.map((m) => m.Approved) || [],
                        backgroundColor: 'rgba(16, 185, 129, 0.85)',
                        borderRadius: 6,
                    },
                    {
                        label: 'Pending',
                        data: trends?.appointmentsMonthly.map((m) => m.Pending) || [],
                        backgroundColor: 'rgba(245, 158, 11, 0.85)',
                        borderRadius: 6,
                    },
                    {
                        label: 'Completed',
                        data: trends?.appointmentsMonthly.map((m) => m.Completed) || [],
                        backgroundColor: 'rgba(59, 130, 246, 0.85)',
                        borderRadius: 6,
                    },
                    {
                        label: 'Rejected',
                        data: trends?.appointmentsMonthly.map((m) => m.Rejected) || [],
                        backgroundColor: 'rgba(239, 68, 68, 0.75)',
                        borderRadius: 6,
                    },
                ],
            };
        }

        if (barMetric === 'cases') {
            return {
                labels,
                datasets: [
                    {
                        label: 'Physical Impairment',
                        data: trends?.casesMonthly.map((m) => m.Physical) || [],
                        backgroundColor: 'rgba(249, 115, 22, 0.85)',
                        borderRadius: 6,
                    },
                    {
                        label: 'Mental Health',
                        data: trends?.casesMonthly.map((m) => m.Mental) || [],
                        backgroundColor: 'rgba(59, 130, 246, 0.85)',
                        borderRadius: 6,
                    },
                    {
                        label: 'Policy & Other Cases',
                        data: trends?.casesMonthly.map((m) => m.Other) || [],
                        backgroundColor: 'rgba(139, 92, 246, 0.85)',
                        borderRadius: 6,
                    },
                ],
            };
        }

        // Default: Reports by Priority
        return {
            labels,
            datasets: [
                {
                    label: 'Critical',
                    data: trends?.reportsMonthly.map((m) => m.Critical) || [],
                    backgroundColor: 'rgba(220, 38, 38, 0.9)',
                    borderRadius: 6,
                },
                {
                    label: 'High',
                    data: trends?.reportsMonthly.map((m) => m.High) || [],
                    backgroundColor: 'rgba(249, 115, 22, 0.85)',
                    borderRadius: 6,
                },
                {
                    label: 'Medium',
                    data: trends?.reportsMonthly.map((m) => m.Medium) || [],
                    backgroundColor: 'rgba(234, 179, 8, 0.85)',
                    borderRadius: 6,
                },
                {
                    label: 'Low',
                    data: trends?.reportsMonthly.map((m) => m.Low) || [],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderRadius: 6,
                },
            ],
        };
    };

    const barOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 16,
                    font: {
                        size: 11,
                        weight: 'bold',
                    },
                    color: '#4b5563',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.92)',
                padding: 12,
                cornerRadius: 12,
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 12 },
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                ticks: {
                    font: { size: 11, weight: 'bold' },
                    color: '#6b7280',
                },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                    font: { size: 11, weight: 'bold' },
                    color: '#6b7280',
                },
                grid: {
                    color: 'rgba(229, 231, 235, 0.6)',
                },
            },
        },
    };

    // ── Pie / Doughnut Chart Data ──
    const physical = stats.physicallyDisabled || 0;
    const mental = stats.mentalHealthConcerns || 0;
    const other = stats.otherConcerns || 0;
    const healthy = Math.max(0, stats.healthy || 0);
    const totalPop = physical + mental + other + healthy;

    const distributionItems = [
        { label: 'Physical Impairment', value: physical, color: '#f97316', bg: 'bg-orange-500', soft: 'bg-orange-50 text-orange-700' },
        { label: 'Mental Health', value: mental, color: '#3b82f6', bg: 'bg-blue-500', soft: 'bg-blue-50 text-blue-700' },
        { label: 'Policy & Other Cases', value: other, color: '#eab308', bg: 'bg-yellow-500', soft: 'bg-yellow-50 text-yellow-700' },
        { label: 'Cleared Students', value: healthy, color: '#10b981', bg: 'bg-emerald-500', soft: 'bg-emerald-50 text-emerald-700' },
    ];

    const pieData = {
        labels: distributionItems.map((i) => i.label),
        datasets: [
            {
                data: totalPop > 0 ? distributionItems.map((i) => i.value) : [0, 0, 0, 1],
                backgroundColor: totalPop > 0
                    ? distributionItems.map((i) => i.color)
                    : ['#e5e7eb', '#e5e7eb', '#e5e7eb', '#e5e7eb'],
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 6,
            },
        ],
    };

    const pieOptions: ChartOptions<'doughnut'> & ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: totalPop > 0,
                backgroundColor: 'rgba(17, 24, 39, 0.92)',
                padding: 12,
                cornerRadius: 12,
                callbacks: {
                    label: (ctx) => {
                        const val = Number(ctx.raw || 0);
                        const pct = totalPop > 0 ? ((val / totalPop) * 100).toFixed(1) : '0.0';
                        return ` ${ctx.label}: ${val} (${pct}%)`;
                    },
                },
            },
        },
        cutout: pieMode === 'doughnut' ? '66%' : '0%',
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Bar Chart: Monthly Trends */}
            <div className="xl:col-span-7 glass-slab rounded-3xl sm:rounded-4xl p-5 sm:p-8 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                            <BarChart3 className="text-primary-main shrink-0" size={22} />
                            Monthly Welfare & Support Trends
                        </h2>
                        <p className="text-gray-500 text-xs sm:text-sm mt-0.5 font-medium italic">
                            Support reports, counseling sessions, and welfare cases in {selectedYear}.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-gray-100/80 px-3 py-1.5 rounded-xl border border-gray-200/70">
                            <Calendar size={14} className="text-gray-500" />
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="bg-transparent text-xs font-black text-gray-700 outline-none cursor-pointer"
                            >
                                {[currentYear, currentYear - 1, currentYear - 2].map((yr) => (
                                    <option key={yr} value={yr}>{yr}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Metric Switcher */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {[
                        { id: 'reports' as BarMetric, label: 'Support Reports' },
                        { id: 'appointments' as BarMetric, label: 'Counseling Sessions' },
                        { id: 'cases' as BarMetric, label: 'Welfare Cases' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setBarMetric(tab.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                                barMetric === tab.id
                                    ? 'bg-primary-main text-white shadow-md shadow-primary-main/20'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Chart Canvas */}
                <div className="relative h-64 sm:h-72 w-full">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                            <Loader2 size={28} className="animate-spin text-primary-main" />
                            <span className="text-xs font-bold uppercase tracking-widest">Loading Chart Data...</span>
                        </div>
                    ) : (
                        <Bar data={getBarData()} options={barOptions} />
                    )}
                </div>
            </div>

            {/* Pie / Doughnut Chart: Student Vulnerability Distribution */}
            <div className="xl:col-span-5 glass-slab rounded-3xl sm:rounded-4xl p-5 sm:p-8 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                        <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                            <PieChartIcon className="text-primary-main shrink-0" size={22} />
                            Student Welfare Distribution
                        </h2>
                        <p className="text-gray-500 text-xs sm:text-sm mt-0.5 font-medium italic">
                            Active welfare cases vs. cleared student population.
                        </p>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                        <button
                            onClick={() => setPieMode('doughnut')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                pieMode === 'doughnut' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            Donut
                        </button>
                        <button
                            onClick={() => setPieMode('pie')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                pieMode === 'pie' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            Pie
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 xl:grid-cols-12 gap-5 items-center my-auto">
                    <div className="sm:col-span-5 xl:col-span-5 relative h-48 sm:h-52 w-full flex items-center justify-center">
                        {pieMode === 'doughnut' ? (
                            <Doughnut data={pieData} options={pieOptions} />
                        ) : (
                            <Pie data={pieData} options={pieOptions} />
                        )}
                        {pieMode === 'doughnut' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">{totalPop}</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Students</span>
                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-7 xl:col-span-7 space-y-2.5">
                        {distributionItems.map((item) => {
                            const pct = totalPop > 0 ? ((item.value / totalPop) * 100).toFixed(1) : '0.0';
                            return (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between gap-2 p-2.5 px-3 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-white transition-colors"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.bg}`} />
                                        <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-sm font-black text-gray-900">{item.value}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${item.soft}`}>
                                            {pct}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;

