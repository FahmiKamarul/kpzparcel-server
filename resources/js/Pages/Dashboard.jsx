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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

export default function Dashboard({ auth, stats, chartData, filters, disposalList }) { // Added disposalList prop
    
    const handleDateChange = (field, value) => {
        const newFilters = {
            start_date: filters.start_date,
            end_date: filters.end_date,
            [field]: value, 
        };
        router.get(route('dashboard'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            only: ['stats', 'chartData', 'filters', 'disposalList']
        });
    };

    const handlePrint = () => {
        window.print();
    };

    // --- Charts (Unchanged) ---
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Sales Performance' },
        },
        scales: { y: { beginAtZero: true } }
    };

    const areaChartData = {
        labels: chartData.labels,
        datasets: [{
            label: chartData.label, 
            data: chartData.data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4,
        }],
    };

    const distributionData = {
        labels: ['Collected', 'Uncollected'],
        datasets: [{
            data: [stats.collected, stats.uncollected], 
            backgroundColor: ['#4BC0C0', '#FF6384'],
            hoverOffset: 4
        }]
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Parcel Status Distribution' }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <style>{`
                @media print {
                    nav, aside, header, .no-print { display: none !important; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
                    .shadow-sm, .shadow-md { box-shadow: none !important; border: 1px solid #ccc !important; }
                    .max-w-7xl { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
                    @page { margin: 1cm; }
                    /* Make table text smaller on print to fit more rows */
                    .disposal-table td, .disposal-table th { font-size: 10px !important; padding: 4px !important; }
                }
            `}</style>

            <div className="py-6 bg-gray-50 min-h-screen print:bg-white print:py-0">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Dashboard Report</h1>
                            <p className="text-sm text-gray-500">KPZ Parcel Management Center</p>
                            <p className="hidden print:block text-xs text-gray-400 mt-1">Period: {filters.start_date} to {filters.end_date}</p>
                        </div>

                        {/* CONTROLS */}
                        <div className="flex flex-wrap items-center gap-3 no-print">
                            <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm text-sm font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print PDF
                            </button>
                            <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <label className="text-gray-600 font-semibold text-xs pl-2">From:</label>
                                    <input type="date" value={filters.start_date} onChange={(e) => handleDateChange('start_date', e.target.value)} className="border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 text-sm" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-gray-600 font-semibold text-xs">To:</label>
                                    <input type="date" value={filters.end_date} onChange={(e) => handleDateChange('end_date', e.target.value)} className="border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TOP STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:grid-cols-4 print:gap-2">
                        <div className="bg-orange-200 p-5 rounded-xl shadow-sm border border-orange-300 print:border-gray-300 print:bg-orange-100">
                            <h3 className="text-xs font-bold text-orange-800 uppercase mb-1">Total Staff</h3>
                            <p className="text-3xl font-black text-gray-900">{stats.totalStaff}</p>
                        </div>
                        <div className="bg-pink-200 p-5 rounded-xl shadow-sm border border-pink-300 print:border-gray-300 print:bg-pink-100">
                            <h3 className="text-xs font-bold text-pink-800 uppercase mb-1">Total Parcels</h3>
                            <p className="text-3xl font-black text-gray-900">{stats.totalParcels}</p>
                        </div>
                        <div className="bg-red-200 p-5 rounded-xl shadow-sm border border-red-300 print:border-gray-300 print:bg-red-100">
                            <h3 className="text-xs font-bold text-red-800 uppercase mb-1">Late Parcels</h3>
                            <p className="text-3xl font-black text-gray-900">{stats.late}</p>
                        </div>
                        <div className="bg-cyan-300 p-5 rounded-xl shadow-sm border border-cyan-400 print:border-gray-300 print:bg-cyan-100">
                            <h3 className="text-xs font-bold text-cyan-800 uppercase mb-1">Total Income</h3>
                            <p className="text-3xl font-black text-gray-900">RM {stats.income}</p>
                        </div>
                    </div>

                    {/* MAIN CONTENT GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
                        
                        {/* LEFT: Main Chart */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100 print:shadow-none print:border-gray-300 print:mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-700">Parcel Inflow Trends</h3>
                                <span className="text-xs text-gray-400 font-medium">Daily Data Representation</span>
                            </div>
                            <div className="h-[400px] print:h-[300px]"> 
                                <Line options={{...lineChartOptions, maintainAspectRatio: false}} data={areaChartData} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col gap-6 print:grid print:grid-cols-2 print:gap-4">
                            
                            {/* Combined Donut */}
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center justify-center print:shadow-none print:border-gray-300">
                                <div className="w-full max-w-[200px]">
                                    <Doughnut data={distributionData} options={doughnutOptions} />
                                </div>
                            </div>

                            {/* Status & Disposal Container */}
                            <div className="flex flex-col gap-4">
                                
                                {/* Status Check Box */}
                                <div className={`p-5 rounded-xl border-l-4 ${stats.uncollected > 10 ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-500'} print:border print:border-gray-300`}>
                                     <h3 className="font-bold text-sm text-gray-800">Status Check</h3>
                                     <p className="text-xs mt-1 text-gray-700">
                                         Currently {stats.uncollected} parcels waiting.
                                     </p>
                                </div>

                                {/* NEW: Disposal List */}
                                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 print:shadow-none print:border-gray-300">
                                     <h3 className="font-bold text-xs text-red-600 uppercase mb-3 flex items-center justify-between">
                                        <span>⚠️ Disposal List ({'>'}14 Days)</span>
                                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-[10px]">{disposalList.length}</span>
                                     </h3>
                                     
                                     {disposalList.length > 0 ? (
                                         <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-100">
                                             <table className="w-full text-xs text-left disposal-table">
                                                <thead className="bg-gray-50 text-gray-500 font-semibold border-b">
                                                    <tr>
                                                        <th className="px-3 py-2">Tracking</th>
                                                        <th className="px-3 py-2">Shelf</th>
                                                        <th className="px-3 py-2 text-right">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {disposalList.map((parcel) => (
                                                        <tr key={parcel.TrackingNum} className="hover:bg-gray-50">
                                                            <td className="px-3 py-2 font-medium text-gray-900">{parcel.TrackingNum}</td>
                                                            <td className="px-3 py-2 text-gray-600">{parcel.ShelfNum}</td>
                                                            <td className="px-3 py-2 text-right text-red-500">{parcel.DateArrive}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                             </table>
                                         </div>
                                     ) : (
                                         <p className="text-xs text-gray-400 italic text-center py-2">No parcels require disposal.</p>
                                     )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}