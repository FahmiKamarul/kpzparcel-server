// src/Pages/ManageParcel.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react'; // Added router for the Pay action
import React, { useState, useMemo } from 'react'; 
import { ParcelCard } from '@/Components/ParcelCard'; 

export default function ManageParcel({ auth, parcels }) {
    
    // 1. Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // 2. Selection State (Stores an array of selected Parcel IDs)
    const [selectedIds, setSelectedIds] = useState([]);

    // 3. Filter Logic
    const filteredParcels = useMemo(() => {
        return parcels.filter(parcel => {
            const matchesSearch = parcel.TrackingNum.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || parcel.Status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [parcels, searchTerm, statusFilter]);

    // 4. Handle Individual Checkbox Toggle
    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // 5. Handle "Select All" Logic
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Select all visible parcels
            const allVisibleIds = filteredParcels.map(p => p.id || p.TrackingNum); // Prefer ID, fallback to TrackingNum
            setSelectedIds(allVisibleIds);
        } else {
            // Deselect all
            setSelectedIds([]);
        }
    };

    // 6. Calculate Total Price
    const totalAmount = selectedIds.reduce((sum, id) => {
        // Find the parcel object
        const parcel = parcels.find(p => (p.id || p.TrackingNum) === id);
        // Ensure price is a number (Assuming parcel.Price is a number or string like "2.00")
        const price = parcel ? parseFloat(parcel.Price) : 0; 
        return sum + price;
    }, 0);

    // 7. Handle Payment Action
    const handleBulkPay = () => {
        if (selectedIds.length === 0) return;
        
        // Example: Send selected IDs to your backend route
        console.log("Paying for:", selectedIds);
        
        // router.post(route('parcel.bulkPay'), { ids: selectedIds });
        alert(`Processing payment for ${selectedIds.length} parcels. Total: RM ${totalAmount.toFixed(2)}`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Parcel Management" />

            {/* Added pb-32 to create space for the floating bar so it doesn't cover content */}
            <div className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen pb-32">
                
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
                        <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
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

                {/* Filters & Select All Row */}
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
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

                    {/* SELECT ALL CHECKBOX */}
                    <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
                        <input 
                            type="checkbox" 
                            id="selectAll"
                            // Checked if visible count > 0 AND all visible are selected
                            checked={filteredParcels.length > 0 && filteredParcels.every(p => selectedIds.includes(p.id || p.TrackingNum))}
                            onChange={handleSelectAll}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="selectAll" className="ml-2 text-gray-700 font-medium cursor-pointer select-none">
                            Select All
                        </label>
                    </div>
                </div>

                {/* Parcel Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredParcels.length > 0 ? (
                        filteredParcels.map((parcel) => (
                            <ParcelCard 
                                key={parcel.TrackingNum} 
                                parcel={parcel}
                                // Pass selection props
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

            {/* --- FLOATING ACTION BAR (Sticky Footer) --- */}
            <div 
                className={`fixed bottom-0 left-0 w-full bg-white border-t-4 border-blue-600 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-50 transition-transform duration-300 ease-in-out ${
                    selectedIds.length > 0 ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    
                    {/* Count */}
                    <div className="text-gray-700 font-medium">
                        <span className="font-bold text-blue-600 text-lg">{selectedIds.length}</span> parcels selected
                    </div>

                    {/* Total & Button */}
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