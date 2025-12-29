import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function PaymentPage({ auth, parcels = [] }) {
    const [paymentMethod, setPaymentMethod] = useState(null);

    // Calculate Total Price dynamically
    const totalAmount = useMemo(() => {
        return parcels.reduce((sum, item) => sum + parseFloat(item.Price || 0), 0);
    }, [parcels]);

    const handlePay = () => {
        if (!paymentMethod) return;
        
        // Send the list of IDs to your backend processing route
        const parcelIds = parcels.map(p => p.id || p.TrackingNum);
        
        console.log(`Processing payment for ${parcelIds.length} items via ${paymentMethod}`);
        
        // Example: router.post(route('payment.process'), { ids: parcelIds, method: paymentMethod });
        alert(`Payment successful for ${parcels.length} parcels!`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Payment" />

            <div className="min-h-[calc(100vh-64px)] bg-white flex flex-col items-center py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-800 uppercase mb-8">
                    Payment Review
                </h1>

                {/* --- Parcel Summary Area --- */}
                {/* We use a max-height and scroll if there are many items */}
                <div className="w-full max-w-2xl border-2 border-blue-600 rounded-2xl p-6 mb-8 shadow-sm bg-white">
                    
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-bold text-gray-700">Order Summary</h2>
                        <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-bold">
                            {parcels.length} Item{parcels.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
                        {parcels.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                {/* Left: Details */}
                                <div className="text-gray-800 text-sm space-y-1">
                                    <p><span className="font-semibold">Tracking:</span> {item.TrackingNum}</p>
                                    <p><span className="font-semibold">Name:</span> {item.CustName || item.CustomerName}</p>
                                    <p><span className="font-semibold">Date Arrived:</span> {item.DateArrive}</p>
                                    <p><span className="font-semibold">Penalty:</span></p>
                                    <p className="text-xs text-gray-500">Shelf: {item.ShelfNum} | {item.Weight}kg</p>
                                </div>

                                {/* Right: Price & Courier */}
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 gap-4">
                                    {/* Small Courier Badge */}
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {/* Mock logic for logo text */}
                                        {item.CourierID === 1 ? 'J&T' : 'COURIER'}
                                    </span>
                                    <p className="text-lg font-bold text-blue-600">
                                        RM {Number(item.Price).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Total Amount Header --- */}
                <h2 className="text-3xl font-bold text-blue-600 mb-6">
                    Total: RM {totalAmount.toFixed(2)}
                </h2>

                {/* --- Payment Method Selection --- */}
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Select Payment Method
                </h3>

                <div className="bg-gray-100 p-6 rounded-2xl flex gap-6 mb-8 shadow-inner">
                    {/* Cash Option */}
                    <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex flex-col items-center justify-center w-32 h-32 rounded-xl bg-white shadow-sm transition-all duration-200 border-2 focus:outline-none
                            ${paymentMethod === 'cash' 
                                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                                : 'border-transparent hover:shadow-md hover:border-gray-200'
                            }`}
                    >
                        {/* Cash Icon Placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-bold text-gray-700">Cash</span>
                    </button>

                    {/* E-Wallet Option */}
                    <button
                        onClick={() => setPaymentMethod('ewallet')}
                        className={`flex flex-col items-center justify-center w-32 h-32 rounded-xl bg-white shadow-sm transition-all duration-200 border-2 focus:outline-none
                            ${paymentMethod === 'ewallet' 
                                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                                : 'border-transparent hover:shadow-md hover:border-gray-200'
                            }`}
                    >
                         {/* DuitNow Placeholder */}
                        <div className="h-12 w-12 bg-pink-600 rounded-md flex items-center justify-center text-white font-bold text-xs mb-2 leading-tight text-center p-1">
                            DuitNow <br/> QR
                        </div>
                        <span className="text-sm font-bold text-gray-700">E-Wallet</span>
                    </button>
                </div>

                {/* --- Action Buttons --- */}
                <button
                    onClick={handlePay}
                    disabled={!paymentMethod}
                    className={`w-48 py-3 rounded-full font-bold text-white tracking-wide mb-4 transition-colors duration-200 shadow-md
                        ${paymentMethod 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-gray-400 cursor-not-allowed opacity-70 shadow-none'
                        }`}
                >
                    PAY ALL
                </button>

                <Link 
                    href={route('parcels.manage')} // Ensure this route exists
                    className="text-gray-600 underline hover:text-gray-900 text-sm font-medium"
                >
                    cancel
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}