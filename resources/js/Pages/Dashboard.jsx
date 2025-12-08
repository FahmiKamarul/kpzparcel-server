import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
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
ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler
);

export default function Dashboard({ auth, stats, chartData }) {
    
    // --- Chart Configurations ---
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'This Month Sales vs Last Month Sales' },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    const areaChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'November',
                data: chartData.novSales,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'December',
                data: chartData.decSales,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Data for Doughnut Charts
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
            header={<h2 className="text-xl font-semibold leading-tight text-white">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-white min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* Header Title */}
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-800">DASHBOARD</h1>
                        <div className="mt-2 flex justify-center">
                            <input type="date" className="border rounded-md px-3 py-1 text-gray-600" />
                        </div>
                    </div>

                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN: Main Chart */}
                        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-xl shadow-sm border">
                            <Line options={lineChartOptions} data={areaChartData} />
                        </div>

                        {/* RIGHT COLUMN: KPI Cards & Donuts */}
                        <div className="flex flex-col space-y-4">
                            
                            {/* Card: Total Staff */}
                            <div className="bg-orange-200 p-4 rounded-lg shadow-sm text-center">
                                <h3 className="font-bold text-gray-700">Total Staff :</h3>
                                <p className="text-xl font-bold">{stats.totalStaff}</p>
                            </div>

                            {/* Card: Total Parcel */}
                            <div className="bg-pink-200 p-4 rounded-lg shadow-sm text-center">
                                <h3 className="font-bold text-gray-700">Total Parcel :</h3>
                                <p className="text-xl font-bold">{stats.totalParcels}</p>
                            </div>

                            {/* Donut: Uncollected */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col items-center">
                                <div className="w-24 h-24">
                                    <Doughnut data={uncollectedData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                                </div>
                                <p className="text-sm mt-2 text-gray-600">Uncollected Parcel: {stats.uncollected}/{stats.totalParcels}</p>
                            </div>

                            {/* Card: Collected Parcel */}
                            <div className="bg-green-300 p-4 rounded-lg shadow-sm text-center">
                                <h3 className="font-bold text-gray-700">Total Collected Parcel :</h3>
                                <p className="text-xl font-bold">{stats.collected}</p>
                            </div>

                            {/* Card: Uncollected Parcel */}
                            <div className="bg-yellow-200 p-4 rounded-lg shadow-sm text-center">
                                <h3 className="font-bold text-gray-700">Total Uncollected Parcel :</h3>
                                <p className="text-xl font-bold">{stats.uncollected}</p>
                            </div>

                            {/* Donut: Collected */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col items-center">
                                <div className="w-24 h-24">
                                    <Doughnut data={collectedData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                                </div>
                                <p className="text-sm mt-2 text-gray-600">Collected Parcel: {stats.collected}/{stats.totalParcels}</p>
                            </div>

                            {/* Card: Total Income */}
                            <div className="bg-cyan-300 p-4 rounded-lg shadow-sm text-center">
                                <h3 className="font-bold text-gray-700">Total Income:</h3>
                                <p className="text-xl font-bold">RM {stats.income}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}