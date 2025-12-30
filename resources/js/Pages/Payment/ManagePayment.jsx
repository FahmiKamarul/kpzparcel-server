import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function ManagePayment({ auth, paymentList = [] }) {
    
    // State for the search bar
    const [searchQuery, setSearchQuery] = useState('');
    
    // State for the Filter ('all', '1' for E-Wallet, '0' for Cash)
    const [methodFilter, setMethodFilter] = useState('all');

    // --- AUTO RELOAD LOGIC ---
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ 
                only: ['paymentList'], 
                preserveScroll: true 
            });
        }, 3000); 

        return () => clearInterval(interval);
    }, []);

    // Filter payments based on Search Query AND Method Filter
    const filteredPayments = paymentList.filter(item => {
        // 1. Search Logic
        const matchesSearch = 
            (item.PaymentID && item.PaymentID.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.PaymentMethod && item.PaymentMethod.toString().includes(searchQuery));

        // 2. Filter Logic (0 = Cash, 1 = E-Wallet)
        let matchesFilter = true;
        if (methodFilter !== 'all') {
            matchesFilter = item.PaymentMethod == methodFilter;
        }

        return matchesSearch && matchesFilter;
    });

    // Handle Delete Action
    const handleDelete = (item) => {
        if (confirm(`Are you sure you want to delete Payment ID: ${item.PaymentID}?`)) {
            router.delete(route('payment.destroy', item.PaymentID), {
                preserveScroll: true,
            });
        }
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toFixed(2);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manage Payments" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    
                    {/* TOP BAR: Search & Filters */}
                    <div className="mb-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                        
                        {/* Search Input */}
                        <div className="relative w-full max-w-md">
                            <input 
                                type="text" 
                                placeholder="Search by Payment ID..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg px-5 py-3 pl-12 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                            />
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                        </div>

                        {/* FILTER BUTTONS */}
                        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                            {/* All Button */}
                            <button
                                onClick={() => setMethodFilter('all')}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                    methodFilter === 'all' 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                All
                            </button>

                            {/* E-Wallet Button (Value 1) */}
                            <button
                                onClick={() => setMethodFilter('1')}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                    methodFilter === '1' 
                                        ? 'bg-purple-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                E-Wallet
                            </button>

                            {/* Cash Button (Value 0) */}
                            <button
                                onClick={() => setMethodFilter('0')}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                                    methodFilter === '0' 
                                        ? 'bg-green-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Cash
                            </button>
                        </div>
                    </div>

                    {/* PAYMENT CARDS LIST */}
                    <div className="space-y-6">
                        {filteredPayments.length === 0 ? (
                            <div className="text-center text-gray-500 py-16 text-lg bg-white rounded-xl shadow-md">
                                <p className="mb-2">No payment records found.</p>
                                <p className="text-sm">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            filteredPayments.map((item) => {

                                return (
                                    <div key={item.PaymentID} className="bg-white roSunded-xl shadow-lg p-6 lg:p-8 flex justify-between items-center transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-100 border border-gray-100">
                                        
                                        {/* Left Side: Icon + ID + Info */}
                                        <div className="flex items-center gap-6 lg:gap-8">
                                            
                                            {/* 1. Icon (Changes based on Method) */}
                                            <div className={`flex-shrink-0 h-20 w-20 rounded-full flex items-center justify-center border-2 shadow-sm 
                                                ${item.PaymentMethod == 1 
                                                    ? 'bg-purple-50 border-purple-200 text-purple-600' // E-Wallet Style
                                                    : 'bg-green-50 border-green-200 text-green-600'     // Cash Style
                                                }`}>
                                                
                                                {item.PaymentMethod == 1 ? (
                                                    // E-Wallet Icon (Phone/QR)
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4h8v-4m0 0a3 3 0 01-3 3 3 3 0 01-3-3m-6 0a3 3 0 00-3 3 3 3 0 00-3-3m0 0h2v4h8v-4m0 0h2m-2-5h2m-2-4h2m-7 4h3v1h-3v-1zm-3-2h3v1h-3v-1zm-3 2h3v1h-3v-1zm-3-2h3v1h-3v-1z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                ) : (
                                                    // Cash Icon
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* 2. Payment ID Block */}
                                            <div className="flex-shrink-0 min-w-[100px] h-16 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-700 font-bold p-2 text-center border border-gray-200">
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">ID</span>
                                                <span className="text-lg font-extrabold leading-tight text-gray-800">#{item.PaymentID}</span>
                                            </div>
                                            
                                            {/* 3. Info Block */}
                                            <div className="min-w-0">
                                                <div className="flex items-center space-x-4 mb-1">
                                                    {/* Total Amount Display */}
                                                    <h3 className="text-2xl font-bold text-gray-800 truncate">
                                                        RM{formatCurrency(item.Price)}
                                                    </h3>
                                                    
                                                    {/* Payment Method Badge */}
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider 
                                                        ${item.PaymentMethod == 1 ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                        {item.PaymentMethod == 1 ? 'E-Wallet' : 'Cash'}
                                                    </span>
                                                </div>
                                                
                                                {/* Breakdown of Price vs Penalty */}
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Base:</span> RM{formatCurrency(item.Price-item.PaymentPenalty)} 
                                                    <span className="mx-2 text-gray-300">|</span>
                                                    <span className={`${parseFloat(item.PaymentPenalty) > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                                        Penalty: RM{formatCurrency(item.PaymentPenalty)}
                                                    </span>
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    Date: {item.PaymentDate ? new Date(item.PaymentDate).toLocaleDateString() : 'N/A'} 
                                                    <span className="mx-1">•</span> 
                                                    Created: {new Date(item.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Side: Action Buttons */}
                                        <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                                            <a 
                                                href={route('payment.pdf', item.PaymentID)}
                                                target="_blank" // Opens in new tab
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-semibold flex items-center gap-2 transition-all"
                                            >
                                                {/* Download Icon */}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Download PDF
                                            </a>

                                            
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}