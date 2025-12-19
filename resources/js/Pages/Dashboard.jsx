import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

export default function Dashboard({ auth, stats, chartData, filters }) {
    
    // --- 1. Handle Filter Change ---
    const handleDateChange = (e) => {
        // Reload page with new date param
        router.get(route('dashboard'), { date: e.target.value }, {
            preserveState: true,
            preserveScroll: true,
            only: ['stats', 'chartData', 'filters'] // Only reload data, not layout
        });
    };

    // --- 2. Chart Configurations ---
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Sales Performance' },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    const areaChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: chartData.label, // e.g. "December 2025 Sales"
                data: chartData.data,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Doughnut Data (unchanged)
    const uncollectedData = {
        labels: ['Uncollected', 'Total'],
        datasets: [{
            data: [stats.uncollected, stats.totalParcels],
            backgroundColor: ['#FF6384', '#EEEEEE'],
            borderWidth: 0,
        }]
    };

    const collectedData = {
        labels: ['Collected', 'Total'],
        datasets: [{
            data: [stats.collected, stats.totalParcels],
            backgroundColor: ['#4BC0C0', '#EEEEEE'],
            borderWidth: 0,
        }]
    };

    return (
        <AuthenticatedLayout
    user={auth.user}
    header={<h2 className="text-xl font-semibold leading-tight text-white">Dashboard Overview</h2>}
>
    <Head title="Dashboard" />
    <div className="py-6 bg-gray-70 min-h-screen">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            
            {/* HEADER AREA: Title left, Filter right */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Dashboard</h1>
                    <p className="text-sm text-gray-500">KPZ Parcel Management Center</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                    <label className="text-gray-600 font-semibold text-sm pl-2">Filter Month:</label>
                    <input 
                        type="month" 
                        value={filters.date} 
                        onChange={handleDateChange}
                        className="border-none rounded-md px-4 py-1.5 text-gray-700 focus:ring-0 text-sm font-medium cursor-pointer" 
                    />
                </div>
            </div>

            {/* TOP ROW: STATS CARDS (4 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-orange-200 p-5 rounded-xl shadow-sm border border-orange-300 transition-transform hover:scale-[1.02]">
                    <h3 className="text-xs font-bold text-orange-800 uppercase mb-1">Total Staff</h3>
                    <p className="text-3xl font-black text-gray-900">{stats.totalStaff}</p>
                </div>

                <div className="bg-pink-200 p-5 rounded-xl shadow-sm border border-pink-300 transition-transform hover:scale-[1.02]">
                    <h3 className="text-xs font-bold text-pink-800 uppercase mb-1">Total Parcels</h3>
                    <p className="text-3xl font-black text-gray-900">{stats.totalParcels}</p>
                </div>

                <div className="bg-green-300 p-5 rounded-xl shadow-sm border border-green-400 transition-transform hover:scale-[1.02]">
                    <h3 className="text-xs font-bold text-green-800 uppercase mb-1">Collected</h3>
                    <p className="text-3xl font-black text-gray-900">{stats.collected}</p>
                </div>

                <div className="bg-cyan-300 p-5 rounded-xl shadow-sm border border-cyan-400 transition-transform hover:scale-[1.02]">
                    <h3 className="text-xs font-bold text-cyan-800 uppercase mb-1">Total Income</h3>
                    <p className="text-3xl font-black text-gray-900">RM {stats.income}</p>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: Main Sales Chart (Spans 2 columns) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-700">Parcel Inflow Trends</h3>
                        <span className="text-xs text-gray-400 font-medium">Monthly Data Representation</span>
                    </div>
                    <div className="h-[400px]">
                        <Line options={{...lineChartOptions, maintainAspectRatio: false}} data={areaChartData} />
                    </div>
                </div>

                {/* RIGHT: Visual Health Check (Donuts & Alert Stats) */}
                <div className="flex flex-col gap-6">
                    
                    {/* Uncollected Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
                        <div className="w-24 h-24">
                            <Doughnut data={uncollectedData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                        </div>
                        <div className="text-right">
                            <h3 className="text-sm font-bold text-gray-500 uppercase">Uncollected</h3>
                            <p className="text-3xl font-extrabold text-yellow-600">{stats.uncollected}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Pending pickup</p>
                        </div>
                    </div>

                    {/* Collected Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
                        <div className="w-24 h-24">
                            <Doughnut data={collectedData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                        </div>
                        <div className="text-right">
                            <h3 className="text-sm font-bold text-gray-500 uppercase">Collected</h3>
                            <p className="text-3xl font-extrabold text-green-600">{stats.collected}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Successful collected</p>
                        </div>
                    </div>

                    {/* Detailed Warning Card */}
                    <div className="bg-yellow-100 p-5 rounded-xl border-l-4 border-yellow-500">
                         <h3 className="font-bold text-yellow-800 text-sm">Action Required</h3>
                         <p className="text-xs text-yellow-700 mt-1">There are currently {stats.uncollected} parcels waiting for collection. Contact staff if this number exceeds threshold.</p>
                    </div>

                </div>
            </div>
        </div>
    </div>
</AuthenticatedLayout>
    );
}