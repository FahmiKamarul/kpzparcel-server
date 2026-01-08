// resources/js/Pages/Parcel/Create.jsx

import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useZxing } from "react-zxing"; // 1. Import scanner hook

// --- Helper Component: Barcode Scanner Modal ---
const BarcodeScannerModal = ({ onClose, onScan }) => {
    const { ref } = useZxing({
        onDecodeResult(result) {
            onScan(result.getText());
            onClose(); 
        },
    });

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-lg w-full relative">
                <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg">Scan Tracking Number</h3>
                    <button onClick={onClose} className="text-gray-300 hover:text-white">&times;</button>
                </div>
                <div className="relative bg-black h-64 sm:h-80 flex items-center justify-center overflow-hidden">
                    <video ref={ref} className="absolute min-w-full min-h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-red-500/50 opacity-50 z-10 pointer-events-none rounded-lg m-8"></div>
                    <div className="absolute w-full h-0.5 bg-red-600 top-1/2 left-0 z-20 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                </div>
                <div className="p-4 text-center text-sm text-gray-600">
                    Point camera at the barcode
                </div>
            </div>
        </div>
    );
};

export default function Create({ auth, courierOptions }) { 
    
    // 2. State for scanner visibility
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const defaultCourierID = courierOptions.length > 0 ? courierOptions[0].CourierID : '';

    const calculatePrice = (weight) => {
        if (!weight || weight <= 0) return 0;
        if (weight <= 2) return 2;
        const additionalWeight = weight - 2;
        const particiant = Math.ceil(additionalWeight );
        return 2 + particiant * 0.5;
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        TrackingNum: '',
        CourierID: defaultCourierID,
        StaffID: auth.user.StaffID,
        CustomerName: '',
        ShelfNum: '',
        Weight: '', 
        DateArrive: new Date().toISOString().slice(0, 10), 
        Price: '',
        Status: 'Pending',
    });
    
    const handleWeightChange = (weight) => {
        setData('Weight', weight);
        const calculatedPrice = calculatePrice(parseFloat(weight));
        setData('Price', calculatedPrice);
    };
    
    // 3. Handle successful scan
    const handleScanResult = (result) => {
        setData('TrackingNum', result);
        // Optional: Play beep
        // new Audio('/beep.mp3').play().catch(() => {}); 
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('parcel.store'), {
            onSuccess: () => {
                reset();
            }
        });
    };

    const inputClass = 'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Parcel</h2>}
        >
            <Head title="Add Parcel" />

            {/* 4. Render Scanner Modal */}
            {isScannerOpen && (
                <BarcodeScannerModal 
                    onClose={() => setIsScannerOpen(false)} 
                    onScan={handleScanResult} 
                />
            )}

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Parcel Details</h3>
                            
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                {/* TrackingNum with Scan Button */}
                                <div>
                                    <label htmlFor="TrackingNum" className="block text-sm font-medium text-gray-700">Tracking Number</label>
                                    <div className="relative mt-1">
                                        <input
                                            id="TrackingNum"
                                            type="text"
                                            value={data.TrackingNum}
                                            onChange={(e) => setData('TrackingNum', e.target.value)}
                                            // Added padding-right (pr-10) so text doesn't overlap icon
                                            className={`${inputClass} pr-10 mt-0`} 
                                            required
                                        />
                                        
                                        {/* Scan Button positioned inside input */}
                                        <button 
                                            type="button" // Important: type="button" prevents form submission
                                            onClick={() => setIsScannerOpen(true)}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition"
                                            title="Scan Barcode"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                        </button>
                                    </div>
                                    {errors.TrackingNum && <div className="text-red-500 text-xs mt-1">{errors.TrackingNum}</div>}
                                </div>

                                {/* CourierID */}
                                <div>
                                    <label htmlFor="CourierID" className="block text-sm font-medium text-gray-700">Courier Service</label>
                                    <select
                                        id="CourierID"
                                        value={data.CourierID}
                                        onChange={(e) => setData('CourierID', e.target.value)}
                                        className={inputClass}
                                        required
                                    >
                                        {courierOptions.map(courier => (
                                            <option key={courier.CourierID} value={courier.CourierID}>
                                                {courier.CourierName} ({courier.CourierID})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.CourierID && <div className="text-red-500 text-xs mt-1">{errors.CourierID}</div>}
                                </div>

                                {/* CustomerName */}
                                <div>
                                    <label htmlFor="CustomerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
                                    <input
                                        id="CustomerName"
                                        type="text"
                                        value={data.CustomerName}
                                        onChange={(e) => setData('CustomerName', e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                    {errors.CustomerName && <div className="text-red-500 text-xs mt-1">{errors.CustomerName}</div>}
                                </div>

                                {/* ShelfNum */}
                                <div>
                                    <label htmlFor="ShelfNum" className="block text-sm font-medium text-gray-700">Shelf Number</label>
                                    <input
                                        id="ShelfNum"
                                        type="text"
                                        value={data.ShelfNum}
                                        onChange={(e) => setData('ShelfNum', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.ShelfNum && <div className="text-red-500 text-xs mt-1">{errors.ShelfNum}</div>}
                                </div>
                                
                                {/* DateArrive */}
                                <div>
                                    <label htmlFor="DateArrive" className="block text-sm font-medium text-gray-700">Arrival Date</label>
                                    <input
                                        id="DateArrive"
                                        type="date"
                                        value={data.DateArrive}
                                        onChange={(e) => setData('DateArrive', e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                    {errors.DateArrive && <div className="text-red-500 text-xs mt-1">{errors.DateArrive}</div>}
                                </div>

                                {/* Weight */}
                                <div>
                                    <label htmlFor="Weight" className="block text-sm font-medium text-gray-700">Weight (Kg)</label>
                                    <input
                                        id="Weight"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.Weight}
                                        onChange={(e) => handleWeightChange(e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.Weight && <div className="text-red-500 text-xs mt-1">{errors.Weight}</div>}
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="Price" className="block text-sm font-medium text-gray-700">Price (RM)</label>
                                    <input
                                        id="Price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.Price}
                                        readOnly
                                        className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Calculated automatically based on weight</p>
                                    {errors.Price && <div className="text-red-500 text-xs mt-1">{errors.Price}</div>}
                                </div>

                                {/* Hidden Status Field Context */}
                                <div className="col-span-1 md:col-span-2">
                                    <p className="text-sm text-gray-500 italic">
                                        * The initial Status is automatically set to **"{data.Status}"**.
                                    </p>
                                </div>
                            </div>
                            
                            <input type="hidden" name="StaffID" value={data.StaffID} />
                            
                            <div className="flex items-center justify-start mt-8">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'SAVE PARCEL'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}