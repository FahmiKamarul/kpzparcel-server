// src/Pages/ManageParcel.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useMemo, useEffect } from 'react'; 
import { ParcelCard } from '@/Components/ParcelCard'; 
// 1. Import the scanning hook
import { useZxing } from "react-zxing";

// --- Helper Component: Barcode Scanner Modal ---
const BarcodeScannerModal = ({ onClose, onScan }) => {
    // Standard parcel barcodes are usually Code 128 or Code 39, but zxing handles most by default.
    const { ref } = useZxing({
        onDecodeResult(result) {
            // Once a code is found, pass it up and close the scanner
            onScan(result.getText());
            onClose(); 
        },
        // Optional: specific format constraints can be added here if needed
    });

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-lg w-full relative">
                <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg">Scan Barcode</h3>
                    <button onClick={onClose} className="text-gray-300 hover:text-white">&times;</button>
                </div>
                <div className="relative bg-black h-64 sm:h-80 flex items-center justify-center overflow-hidden">
                    {/* The video element acts as the camera view */}
                    <video ref={ref} className="absolute min-w-full min-h-full object-cover" />
                    
                    {/* Visual Guide Overlay (Red Line) */}
                    <div className="absolute inset-0 border-2 border-red-500/50 opacity-50 z-10 pointer-events-none rounded-lg m-8"></div>
                    <div className="absolute w-full h-0.5 bg-red-600 top-1/2 left-0 z-20 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                </div>
                <div className="p-4 text-center text-sm text-gray-600">
                    Point camera at the parcel tracking number
                </div>
            </div>
        </div>
    );
};

export default function ManageParcel({ auth, parcels, flash }) {
    
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFlash, setShowFlash] = useState(false);
    
    // 2. Add state for scanner visibility
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    useEffect(() => {
        if (flash.message) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const [selectedIds, setSelectedIds] = useState([]);
    
    // Auto-refresh logic (Kept as is)
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['parcels'],    
                preserveScroll: true, 
                preserveState: true,  
            });
        }, 5000); 
        return () => clearInterval(interval);
    }, []);

    // Filter Logic (Kept as is)
    const filteredParcels = useMemo(() => {
        return parcels.filter(parcel => {
            const matchesSearch = parcel.TrackingNum.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || parcel.Status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [parcels, searchTerm, statusFilter]);

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allVisibleIds = filteredParcels.map(p => p.id || p.TrackingNum);
            setSelectedIds(allVisibleIds);
        } else {
            setSelectedIds([]);
        }
    };

    const totalAmount = selectedIds.reduce((sum, id) => {
        const parcel = parcels.find(p => (p.id || p.TrackingNum) === id);
        const price = parcel ? parseFloat(parcel.Price) : 0; 
        return sum + price;
    }, 0);

    const handleBulkPay = () => {
        if (selectedIds.length === 0) return;
        router.get(route('payment.bulk'), { ids: selectedIds });
    };

    // 3. Handler for successful scan
    const handleScanResult = (result) => {
        setSearchTerm(result);
        // Optional: Play a beep sound
        // new Audio('/beep.mp3').play().catch(e => console.log('Audio play failed', e));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Parcel Management" />

            {/* 4. Render Scanner Modal if open */}
            {isScannerOpen && (
                <BarcodeScannerModal 
                    onClose={() => setIsScannerOpen(false)} 
                    onScan={handleScanResult} 
                />
            )}

            <div className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen pb-32">
                {/* Flash Message ... */}
                {flash.message && showFlash && (
                    <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-sm flex justify-between items-center animate-fade-in-down">
                        <div>
                            <p className="font-bold">Success</p>
                            <p>{flash.message}</p>
                        </div>
                        <button 
                            onClick={() => setShowFlash(false)}
                            className="text-green-700 hover:text-green-900 font-bold"
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Search Bar Row */}
                <div className="flex justify-start items-center mb-6 gap-4">
                    <div className="relative w-96 flex">
                        <input
                            type="text"
                            placeholder="Tracking Number"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // Added padding-right (pr-20) to make room for two icons
                            className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        
                        {/* Container for Icons */}
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                            {/* SCAN BUTTON */}
                            <button 
                                onClick={() => setIsScannerOpen(true)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Scan Barcode"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </button>

                            {/* Existing Search Icon */}
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    
                    <Link
                        href={route('parcel.create')}
                        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-150 flex items-center whitespace-nowrap"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        ADD PARCEL
                    </Link>
                </div>

                {/* Filters, Grid, and Floating Bar remain unchanged below... */}
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    {/* ... (Existing Filter buttons code) ... */}
                    <div className="flex gap-3">
                        {['all', 'collected', 'ready'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-6 py-2 rounded-lg font-medium transition duration-150 capitalize ${
                                    statusFilter === status
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
                        <input 
                            type="checkbox" 
                            id="selectAll"
                            checked={filteredParcels.length > 0 && filteredParcels.every(p => selectedIds.includes(p.id || p.TrackingNum))}
                            onChange={handleSelectAll}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="selectAll" className="ml-2 text-gray-700 font-medium cursor-pointer select-none">
                            Select All
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredParcels.length > 0 ? (
                        filteredParcels.map((parcel) => (
                            <ParcelCard 
                                key={parcel.TrackingNum} 
                                parcel={parcel}
                                isSelected={selectedIds.includes(parcel.id || parcel.TrackingNum)}
                                onToggle={() => toggleSelection(parcel.id || parcel.TrackingNum)}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-8">
                            No parcels found. Try adjusting your search term.
                        </p>
                    )}
                </div>
            </div>

            <div 
                className={`fixed bottom-0 left-0 w-full bg-white border-t-4 border-blue-600 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-50 transition-transform duration-300 ease-in-out ${
                    selectedIds.length > 0 ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="text-gray-700 font-medium">
                        <span className="font-bold text-blue-600 text-lg">{selectedIds.length}</span> parcels selected
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900">RM {totalAmount.toFixed(2)}</p>
                        </div>
                        
                        <button 
                            onClick={handleBulkPay}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors text-lg"
                        >
                            PAY SELECTED
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}