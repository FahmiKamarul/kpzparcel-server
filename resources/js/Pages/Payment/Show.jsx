import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function PaymentPage({ auth, parcels = [] }) {
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [cashReceived, setCashReceived] = useState('');

    // Helper: Calculate how many days are overdue
    const getOverdueDays = (dateArrive) => {
        const arrival = new Date(dateArrive);
        const today = new Date();
        const diffTime = Math.abs(today - arrival);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        // Logic: 1 day penalty for every day after 4 days
        return Math.max(0, diffDays - 4);
    };

    // Calculate All Totals (Base, Penalty, Grand Total)
    const totals = useMemo(() => {
        return parcels.reduce((acc, item) => {
            const basePrice = parseFloat(item.Price || 0);
            const penalty = getOverdueDays(item.DateArrive) * 1; // Rate: RM1 per day
            
            acc.base += basePrice;
            acc.penalty += penalty;
            acc.grandTotal += basePrice + penalty;
            
            return acc;
        }, { base: 0, penalty: 0, grandTotal: 0 });
    }, [parcels]);

    // Logic for Balance Calculator
    const balanceAmount = useMemo(() => {
        if (!cashReceived) return 0;
        return parseFloat(cashReceived) - totals.grandTotal;
    }, [cashReceived, totals.grandTotal]);

    const handlePay = () => {
        if (!paymentMethod) return;
        
        const parcelIds = parcels.map(p => p.id || p.TrackingNum);
        
        router.post(route('payment.process'), { 
            ids: parcelIds, 
            method: paymentMethod,
            total_amount: totals.grandTotal,  
            penalty_amount: totals.penalty 
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Payment" />

            <div className="min-h-[calc(100vh-64px)] bg-white flex flex-col items-center py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-800 uppercase mb-8">
                    Payment Review
                </h1>

                {/* --- Parcel Summary Area --- */}
                <div className="w-full max-w-3xl border-2 border-blue-600 rounded-2xl p-6 mb-8 shadow-sm bg-white">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-bold text-gray-700">Order Summary</h2>
                        <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-bold">
                            {parcels.length} Item{parcels.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                        {parcels.map((item, index) => {
                            const overdueDays = getOverdueDays(item.DateArrive);
                            const penaltyCost = overdueDays * 1; 
                            const basePrice = parseFloat(item.Price || 0);
                            const subtotal = basePrice + penaltyCost;

                            return ( 
                                <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white rounded-xl border-2 border-blue-400 shadow-sm hover:shadow-md transition-shadow">
                                    
                                    {/* LEFT: Parcel Details */}
                                    <div className="text-gray-800 text-sm space-y-1 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4 mb-4 md:mb-0">
                                        <p><span className="font-bold text-black">Tracking Number :</span> {item.TrackingNum}</p>
                                        <p><span className="font-bold text-black">Name :</span> {item.CustName || item.CustomerName}</p>
                                        <p><span className="font-bold text-black">Date Arrived :</span> {item.DateArrive}</p>
                                        <div className="flex justify-between items-center pr-4">
                                            <p className="text-gray-600">Shelf: {item.ShelfNum} | {item.Weight}kg</p>
                                        </div>
                                        {overdueDays > 0 && (
                                            <p className="font-bold text-red-500 mt-1">Penalty : {overdueDays} Days</p>
                                        )}
                                    </div>

                                    {/* RIGHT: Price Breakdown Grid */}
                                    <div className="flex flex-row items-center justify-between w-full md:w-1/2 md:pl-8 gap-2">
                                        <div className="text-center flex-1">
                                            <p className="text-sm font-bold text-black underline mb-1">Price</p>
                                            <p className="text-xl font-bold text-black">RM {Number(basePrice).toFixed(0)}</p>
                                        </div>
                                        <div className="text-center flex-1">
                                            <p className="text-sm font-bold text-red-500 underline mb-1">Penalty</p>
                                            <p className="text-xl font-bold text-red-500">RM {penaltyCost}</p>
                                        </div>
                                        <div className="text-center flex-1">
                                            <p className="text-sm font-bold text-blue-800 underline mb-1">Subtotal</p>
                                            <p className="text-xl font-bold text-blue-800">RM {subtotal}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- TOTALS BREAKDOWN SECTION --- */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-8 w-full max-w-2xl px-4">
                    
                    {/* Total Price */}
                    <div className="text-center">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Price</p>
                        <p className="text-3xl font-bold text-gray-800">
                            RM {totals.base.toFixed(2)}
                        </p>
                    </div>

                    {/* Total Penalty */}
                    <div className="text-center">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Penalty</p>
                        <p className="text-3xl font-bold text-red-500">
                            RM {totals.penalty.toFixed(2)}
                        </p>
                    </div>

                    {/* Grand Total */}
                    <div className="text-center relative">
                        {/* A small vertical divider for desktop view */}
                        <div className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-300"></div>
                        
                        <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">Grand Total</p>
                        <p className="text-4xl font-black text-blue-600">
                            RM {totals.grandTotal.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* --- Payment Method Selection --- */}
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Select Payment Method
                </h3>

                <div className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center w-full max-w-lg mb-8 shadow-inner">
                    
                    {/* Button Group */}
                    <div className="flex gap-6 mb-4">
                        {/* Cash Option */}
                        <button
                            onClick={() => {
                                setPaymentMethod('cash');
                                setCashReceived('');
                            }}
                            className={`flex flex-col items-center justify-center w-32 h-32 rounded-xl bg-white shadow-sm transition-all duration-200 border-2 focus:outline-none
                                ${paymentMethod === 'cash' 
                                    ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                                    : 'border-transparent hover:shadow-md hover:border-gray-200'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-bold text-gray-700">Cash</span>
                        </button>

                        {/* E-Wallet Option */}
                        <button
                            onClick={() => {
                                setPaymentMethod('ewallet');
                                setCashReceived('');
                            }}
                            className={`flex flex-col items-center justify-center w-32 h-32 rounded-xl bg-white shadow-sm transition-all duration-200 border-2 focus:outline-none
                                ${paymentMethod === 'ewallet' 
                                    ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                                    : 'border-transparent hover:shadow-md hover:border-gray-200'
                                }`}
                        >
                            <div className="h-12 w-12 bg-pink-600 rounded-md flex items-center justify-center text-white font-bold text-xs mb-2 leading-tight text-center p-1">
                                DuitNow <br/> QR
                            </div>
                            <span className="text-sm font-bold text-gray-700">E-Wallet</span>
                        </button>
                    </div>

                    {/* Calculator Section */}
                    
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
                    href={route('parcels.manage')}
                    className="text-gray-600 underline hover:text-gray-900 text-sm font-medium"
                >
                    cancel
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}