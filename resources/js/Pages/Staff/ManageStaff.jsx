import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function ManageStaff({ auth, staffList }) {
    
    // State for the search bar
    const [searchQuery, setSearchQuery] = useState('');

    // --- AUTO RELOAD LOGIC (Keep this, it's good) ---
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ 
                only: ['staffList'],
                preserveScroll: true 
            });
        }, 3000); 

        return () => clearInterval(interval);
    }, []);

    // Filter staff based on search input (Client-side)
    const filteredStaff = staffList.filter(user => 
        user.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.StaffID.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleDelete = (user) => {
    // 1. Show the warning
        if (confirm(`Are you sure you want to delete ${user.Name}?`)) {
            
            // 2. If they click "OK", send the delete request
            // Make sure you have a route named 'staff.destroy' or similar in web.php
            router.delete(route('staff.destroy', user.StaffID), {
                preserveScroll: true,
            });
        }
    };
    

    return (
    <AuthenticatedLayout
        user={auth.user}
        // Change header background to match the clean aesthetic
    >
        <Head title="Manage Staff" />

        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                
                {/* TOP BAR: Search & Add Button (No Change) */}
                <div className="flex justify-between items-center mb-12 gap-6">
                    {/* Search Bar */}
                    <div className="relative w-full max-w-md">
                        <input 
                            type="text" 
                            placeholder="Search by Staff Number or Name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-5 py-3 pl-12 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                    </div>
                    
                    {/* Add Staff Button */}
                    <Link
                        href={route('register')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg flex items-center transition-all transform hover:scale-[1.02]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        ADD NEW STAFF
                    </Link>
                </div>

                {/* STAFF CARDS LIST */}
                <div className="space-y-6">
                    {filteredStaff.length === 0 ? (
                        <div className="text-center text-gray-500 py-16 text-lg bg-white rounded-xl shadow-md">
                            <p className="mb-2">No staff matching your search query.</p>
                            <p className="text-sm">Try searching by a different name or staff number.</p>
                        </div>
                    ) : (
                        filteredStaff.map((user) => (
                            // FRESH CARD STYLE
                            <div key={user.id} className="bg-white rounded-xl shadow-lg p-6 lg:p-8 flex justify-between items-center transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-100 border border-gray-100">
                                
                                {/* Left Side: Staff ID, Name & Role */}
                                <div className="flex items-center gap-6 lg:gap-8">
                                    
                                    {/* Staff ID - Prominent Display */}
                                    <div className="flex-shrink-0 min-w-[75px] h-16 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-700 font-bold p-2 text-center">
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Staff ID</span>
                                        <span className="text-xl font-extrabold leading-tight text-blue-600">{user.StaffID}</span>
                                    </div>
                                    
                                    {/* Info Block */}
                                    <div className="min-w-0">
                                        <div className="flex items-center space-x-4">
                                            {/* Name - Primary Focus */}
                                            <h3 className="text-2xl font-semibold text-gray-800 truncate">{user.Name}</h3>
                                            
                                            {/* Status Badge */}
                                            <span 
                                                className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                                                    user.ActiveStatus === 1 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {user.ActiveStatus === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        
                                        {/* Role and StaffID - Secondary Info (StaffID without **) */}
                                        <p className="text-sm text-gray-500 mt-1">
                                            <span className="font-medium text-gray-700">Role:</span> {user.Role}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side: Action Buttons (No Change) */}
                                <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                                    
                                    {/* Update Link (Primary Action) */}
                                    <Link
                                        href={route('staff.update', user.StaffID)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Edit Details
                                    </Link>

                                    {/* Delete Button (Secondary/Warning Action) */}
                                    <button 
                                        onClick={() => handleDelete(user)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        title="Delete Staff"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
);
}