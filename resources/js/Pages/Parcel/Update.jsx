// resources/js/Pages/Parcel/Update.jsx

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// Accept the parcel and courierOptions props
export default function Update({ auth, parcel, courierOptions }) { 
    
    const { data, setData, patch, processing, errors, reset } = useForm({
        TrackingNum: parcel.TrackingNum,
        CourierID: parcel.CourierID,
        StaffID: parcel.StaffID,
        CustomerName: parcel.CustomerName,
        ShelfNum: parcel.ShelfNum,
        Weight: parcel.Weight, 
        DateArrive: parcel.DateArrive ? new Date(parcel.DateArrive).toISOString().slice(0, 10) : '',
        Price: parcel.Price,
        Status: parcel.Status,
    });
    
    const submit = (e) => {
        e.preventDefault();
        patch(route('parcel.update', parcel.TrackingNum), {
            onSuccess: () => {
                // Optionally reset or handle success
            }
        });
    };

    const inputClass = 'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Update Parcel</h2>}
        >
            <Head title="Update Parcel" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Parcel Details</h3>
                            
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                {/* TrackingNum - Read-only */}
                                <div>
                                    <label htmlFor="TrackingNum" className="block text-sm font-medium text-gray-700">Tracking Number <span className="text-red-500">*</span></label>
                                    <input
                                        id="TrackingNum"
                                        type="text"
                                        value={data.TrackingNum}
                                        className={`${inputClass} bg-gray-100`}
                                        readOnly
                                    />
                                </div>

                                {/* CourierID - Dynamically generated */}
                                <div>
                                    <label htmlFor="CourierID" className="block text-sm font-medium text-gray-700">Courier Service <span className="text-red-500">*</span></label>
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
                                    <label htmlFor="CustomerName" className="block text-sm font-medium text-gray-700">Customer Name <span className="text-red-500">*</span></label>
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
                                        onChange={(e) => setData('Weight', e.target.value)}
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
                                        onChange={(e) => setData('Price', e.target.value)}
                                        className={inputClass}
                                    />
                                    {errors.Price && <div className="text-red-500 text-xs mt-1">{errors.Price}</div>}
                                </div>

                                {/* Status - Display only */}
                                <div className="col-span-1 md:col-span-2">
                                    <p className="text-sm text-gray-500 italic">
                                        Current Status: <strong>{data.Status}</strong>
                                    </p>
                                </div>
                            </div>
                            
                            {/* Hidden StaffID Field */}
                            <input type="hidden" name="StaffID" value={data.StaffID} />
                            
                            {/* --- Submission Button --- */}
                            <div className="flex items-center justify-start mt-8">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition"
                                    disabled={processing}
                                >
                                    {processing ? 'Updating...' : 'UPDATE PARCEL'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
