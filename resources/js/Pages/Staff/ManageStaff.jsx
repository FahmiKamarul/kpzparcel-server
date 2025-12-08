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
            header={<h2 className="text-xl font-semibold leading-tight text-white">Manage Staff</h2>}
        >
            <Head title="Manage Staff" />

            <div className="py-12 bg-white min-h-screen">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    
                    {/* TOP BAR: Search & Add Button */}
                    <div className="flex justify-between items-center mb-10 gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full max-w-xl">
                            <input 
                                type="text" 
                                placeholder="Staff Number or Name" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-purple-100 border-none rounded-full px-6 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="absolute right-4 top-3 text-gray-400">🔍</span>
                        </div>
                        
                        {/* Add Staff Button */}
                        <Link
                            href={route('register')}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-md flex items-center transition-transform transform hover:scale-105"
                        >
                            <span className="mr-2 text-xl">+</span> ADD STAFF
                        </Link>
                    </div>

                    {/* STAFF CARDS LIST */}
                    <div className="space-y-6">
                        {filteredStaff.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No staff found.</div>
                        ) : (
                            filteredStaff.map((user) => (
                                <div key={user.id} className="border-2 border-black p-6 flex justify-between items-center bg-white hover:shadow-lg transition-shadow">
                                    
                                    {/* Left Side: ID & Info */}
                                    <div className="flex items-center gap-8">
                                        {/* Staff ID - Big Font */}
                                        <div className="text-5xl font-light text-black tracking-tighter">
                                            {user.StaffID}
                                        </div>
                                        
                                        {/* Name & Role */}
                                        <div>
                                            <h3 className="text-3xl font-bold text-black">{user.Name}</h3>
                                            <p className="text-gray-400 text-xl font-bold mt-1">Role: {user.Role}</p>
                                        </div>
                                    </div>

                                    {/* Right Side: Status & Update Button */}
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-right">
                                            <span className="text-xl text-black font-normal">status:</span>
                                            <div className="text-3xl font-normal text-black">
                                                {user.ActiveStatus == 1 ? 'Active' : 'Inactive'}
                                            </div>
                                        </div>
                                        
                                        {/* Update Link (Green) */}
                                        <Link
                                            href={route('staff.update', user.StaffID)}
                                            className="border border-black px-6 py-1 mt-2 text-xs font-bold text-green-600 uppercase hover:bg-green-50 transition-colors inline-block text-center w-full"
                                        >
                                            UPDATE
                                        </Link>

                                        {/* Delete Button (Red) */}
                                        <button 
                                            onClick={() => handleDelete(user)}
                                            className="border border-black px-6 py-1 text-xs font-bold text-red-600 uppercase hover:bg-red-50 transition-colors w-full"
                                        >
                                            DELETE
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