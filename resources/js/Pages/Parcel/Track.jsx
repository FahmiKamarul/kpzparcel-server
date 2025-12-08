import { Head, Link } from '@inertiajs/react';

export default function Track({ parcel }) {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Head title={`Tracking ${parcel.TrackingNum}`} />

            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-6 text-white">
                    <h1 className="text-2xl font-bold">Parcel Status</h1>
                    <p className="opacity-90">Tracking Number: {parcel.TrackingNum}</p>
                </div>

                {/* Parcel Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Customer</h3>
                        <p className="text-lg font-medium">{parcel.CustomerName}</p>
                    </div>

                    <div>
                        <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Status</h3>
                        <span className="inline-block px-3 py-1 mt-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                            {/* If you have a status column in DB, use {parcel.Status} here */}
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
    );
}