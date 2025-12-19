// src/Pages/ManageParcel.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect } from 'react';
import { Head,Link } from '@inertiajs/react';
import React, { useState } from 'react'; // Added useState for search functionality
import { ParcelCard } from '@/Components/ParcelCard'; // Make sure this is a named export or adjust import

// NOTE: The getCourierLogo function was removed from here as it belongs 
// in ParcelCard or a utility file.

export default function ManageParcel({ auth, parcels }) {
    
    // State for Search Input (Optional, but good for interactive search)
    const [searchTerm, setSearchTerm] = useState('');
    
    // State for Status Filter
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter parcels based on the search term (Tracking Number) and status
    const filteredParcels = parcels.filter(parcel => {
        const matchesSearch = parcel.TrackingNum.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || parcel.Status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        // Pass the required props to the AuthenticatedLayout
        <AuthenticatedLayout
            user={auth.user}

        >
            <Head title="Parcel Management" />

            {/* Main Content Area Container */}
            <div className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
                
                {/* Search Bar and Add Parcel Button */}
                <div className="flex justify-start items-center mb-6 gap-4">
                    <div className="relative w-96">
                        <input
                            type="text"
                            placeholder="Tracking Number"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        {/* Search Icon */}
                        <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    
                    {/* Add Parcel Button (You would typically use <Link> from inertiajs/react here) */}
                    <Link
                        // Set the destination URL using the Laravel route helper
                        href={route('parcel.create')}
                        // Apply all the existing button styling classes to the Link component
                        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-150 flex items-center whitespace-nowrap"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        ADD PARCEL
                    </Link>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-6 py-2 rounded-lg font-medium transition duration-150 ${
                            statusFilter === 'all'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('collected')}
                        className={`px-6 py-2 rounded-lg font-medium transition duration-150 ${
                            statusFilter === 'collected'
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Collected
                    </button>
                    <button
                        onClick={() => setStatusFilter('ready')}
                        className={`px-6 py-2 rounded-lg font-medium transition duration-150 ${
                            statusFilter === 'ready'
                                ? 'bg-orange-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        Ready
                    </button>
                </div>

                {/* Parcel Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredParcels.length > 0 ? (
                        filteredParcels.map((parcel) => (
                            // Use parcel.ID or a database-generated unique ID as the key
                            <ParcelCard key={parcel.TrackingNum} parcel={parcel} />
                        ))
                    ) : (
                        // Message if no parcels match the filter
                        <p className="col-span-full text-center text-gray-500 py-8">
                            No parcels found. Try adjusting your search term.
                        </p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}