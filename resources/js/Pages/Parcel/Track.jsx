import { Head, Link } from '@inertiajs/react';
import Barcode from 'react-barcode'; // 1. Import the library

export default function Track({ parcel }) {
    return (
        // 1. Outer wrapper takes min-height of screen and is a flex column.
        <div className="min-h-screen bg-gray-100 flex flex-col"> 
            <Head title={`Tracking ${parcel.TrackingNum}`} />

            {/* Content area wrapper: adds padding and ensures center alignment. */}
            <div className="p-6">
                
                {/* 2. Main content container: NO flex-grow. This restores the original size/shape. */}
                <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-6 text-white text-center">
                        <h1 className="text-2xl font-bold">Parcel Status</h1>
                        <p className="opacity-90">Tracking Number: {parcel.TrackingNum}</p>
                    </div>


                    {parcel.TrackingNum && (
                        <div className="flex flex-col items-center py-6 border-b border-gray-100">
                            <Barcode 
                                value={parcel.TrackingNum} 
                                width={2}
                                height={60}
                                displayValue={false} 
                            />
                            <h1 className="text-black font-bold">{parcel.TrackingNum}</h1>
                        </div>
                    )}

                    {/* Parcel Details */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Customer</h3>
                            <p className="text-lg font-medium">{parcel.CustomerName}</p>
                        </div>

                        <div>
                            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Status</h3>
                            <span className="inline-block px-3 py-1 mt-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                                {parcel.Status}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Courier</h3>
                            <p className="text-lg font-medium">
                                {parcel.courier ? parcel.courier.CourierName : 'N/A'}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Arrival Date</h3>
                            <p className="text-lg font-medium">{parcel.DateArrive}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Weight</h3>
                            <p className="text-lg font-medium">{parcel.Weight} kg</p>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            &larr; Search Another Parcel
                        </Link>
                    </div>
                </div>
            </div>

            {/* 3. This empty div uses flex-grow to absorb all remaining space
                 between the content above and the footer below, pushing the footer down. */}
            <div className="flex-grow"></div>

            {/* 4. Footer covers the full width and is at the absolute bottom. 
                 Removed 'mt-6' to ensure it's flush against the bottom of the screen. */}
            {/* 🦶 Footer (Optional but good for completeness) */}
            <footer className="bg-blue-500 text-white text-center p-4"> 
                <p className="text-sm opacity-80">
                    &copy; {new Date().getFullYear()} KPZ Parcel
                    Management System. All rights reserved.
                </p>
            </footer>
        </div>
    );
}