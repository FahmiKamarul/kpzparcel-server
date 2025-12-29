import React from 'react';
import { getCourierLogo } from './courierUtils'; 
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react'; 

// 1. Accept isSelected and onToggle props
export function ParcelCard({ parcel, isSelected, onToggle }) {
    const statusColor = parcel.Status === 'Collected' ? 'text-green-600' : 'text-red-600';
    const logoPath = getCourierLogo(parcel.CourierID);

    const arrivalDate = new Date(parcel.DateArrive).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        // 2. Dynamic Styling: Add blue ring and background when selected
        <div className={`relative p-4 rounded-lg shadow-md border-t-4 flex flex-col transition-all duration-200 ${
            isSelected 
                ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500' // Selected Style
                : 'bg-white border-blue-500 hover:shadow-lg'         // Default Style
        }`}>
            
            <div className="flex justify-between items-start mb-3">
                {/* 3. Wrap Content with Checkbox */}
                <div className="flex items-start gap-3">
                    
                    {/* THE CHECKBOX */}
                    <input 
                        type="checkbox" 
                        checked={isSelected || false}
                        onChange={onToggle}
                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer shrink-0"
                    />

                    {/* Original Text Details */}
                    <div className="text-sm">
                        <p className="font-bold text-gray-800">
                            Tracking Number: {parcel.TrackingNum}
                        </p>
                        <p className={`font-bold ${statusColor}`}>
                            {parcel.Status}
                        </p>
                        <p>Shelf Number: {parcel.ShelfNum}</p>
                        <p>Arrival Date: {arrivalDate}</p>
                        <p>Customer Name: {parcel.CustomerName}</p>
                        <p>Weight: {parcel.Weight} Kg</p>
                    </div>
                </div>
                
                {/* Right Side: Price & Actions (Unchanged) */}
                <div className="flex flex-col items-end space-y-2">
                    <Link className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition duration-150 shadow-md"
                        href={route('pay.single', parcel.TrackingNum)}
                    >
                        PAY
                    </Link>
                    <p className="text-lg font-extrabold text-red-600">
                        Price: RM {parseFloat(parcel.Price).toFixed(2)}
                    </p>
                    <img 
                        src={logoPath} 
                        alt={`${parcel.CourierID} Logo`} 
                        className="w-16 h-auto mt-2 object-contain"
                    />
                </div>
            </div>

            {/* Bottom Actions (Unchanged) */}
            <div className="flex gap-2 justify-start pt-3 border-t border-gray-200 mt-auto">
                <Link
                    href={route('parcel.edit', parcel.TrackingNum)}
                    className="bg-yellow-500 text-white text-xs font-semibold px-4 py-1 rounded shadow-md hover:bg-yellow-600 transition duration-150"
                >
                    UPDATE
                </Link>
                <button 
                    className="bg-red-500 text-white text-xs font-semibold px-4 py-1 rounded shadow-md hover:bg-red-600 transition duration-150"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this parcel?')) {
                            Inertia.delete(route('parcel.destroy', parcel.TrackingNum));
                        }
                    }}
                >
                    DELETE
                </button>
            </div>
        </div>
    );
}