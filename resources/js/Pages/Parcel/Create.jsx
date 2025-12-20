// resources/js/Pages/Parcel/Create.jsx

import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// Accept the courierOptions prop
export default function Create({ auth, courierOptions }) { 
    
    // 1. Determine the default CourierID based on the options, or fall back to an empty string
    const defaultCourierID = courierOptions.length > 0 ? courierOptions[0].CourierID : '';

    // 2. Function to calculate price based on weight
    // First 2kg: RM2, then RM1 for each 0.25kg quadrant
    const calculatePrice = (weight) => {
        if (!weight || weight <= 0) return 0;
        if (weight <= 2) return 2;
        const additionalWeight = weight - 2;
        const particiant = Math.ceil(additionalWeight );
        return 2 + particiant*0.5;
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        TrackingNum: '',
        CourierID: defaultCourierID, // Use the dynamically determined default
        StaffID: auth.user.StaffID, // Add StaffID from authenticated user
        CustomerName: '',
        ShelfNum: '',
        Weight: '', 
        DateArrive: new Date().toISOString().slice(0, 10), 
        Price: '',
        Status: 'Pending',
    });
    
    // Handle weight change and auto-calculate price
    const handleWeightChange = (weight) => {
        setData('Weight', weight);
        const calculatedPrice = calculatePrice(parseFloat(weight));
        setData('Price', calculatedPrice);
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

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Parcel Details</h3>
                            
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                {/* TrackingNum */}
                                {/* ... (TrackingNum field remains the same) ... */}
                                <div>
                                    <label htmlFor="TrackingNum" className="block text-sm font-medium text-gray-700">Tracking Number</label>
                                    <input
                                        id="TrackingNum"
                                        type="text"
                                        value={data.TrackingNum}
                                        onChange={(e) => setData('TrackingNum', e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                    {errors.TrackingNum && <div className="text-red-500 text-xs mt-1">{errors.TrackingNum}</div>}
                                </div>


                                {/* CourierID - Dynamically generated */}
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

                                {/* ... (All other fields like CustomerName, ShelfNum, Weight, DateArrive, Price remain the same) ... */}

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

                                {/* Hidden Status Field (for context) */}
                                <div className="col-span-1 md:col-span-2">
                                    <p className="text-sm text-gray-500 italic">
                                        * The initial Status is automatically set to **"{data.Status}"**.
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