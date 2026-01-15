import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function ManageStaff({ auth, staffList, passwordResetRequests }) {
    
    // State for the search bar and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState(''); // '' = All
    const [statusFilter, setStatusFilter] = useState(''); // '' = All

    const { post, processing } = useForm({});

    // --- AUTO RELOAD LOGIC ---
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ 
                only: ['staffList', 'passwordResetRequests'],
                preserveScroll: true 
            });
        }, 3000); 

        return () => clearInterval(interval);
    }, []);

    // Filter staff based on search input AND dropdown filters
    const filteredStaff = staffList.filter(user => {
        // 1. Search Logic
        const matchesSearch = user.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              user.StaffID.toLowerCase().includes(searchQuery.toLowerCase());
        
        // 2. Role Logic (Check exact match if filter is set)
        const matchesRole = roleFilter ? user.Role === roleFilter : true;

        // 3. Status Logic (Check exact match if filter is set)
        // Note: Assuming ActiveStatus is stored as an integer (1 or 0)
        const matchesStatus = statusFilter !== '' ? user.ActiveStatus === parseInt(statusFilter) : true;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleDelete = (user) => {
        if (confirm(`Are you sure you want to delete ${user.Name}?`)) {
            router.delete(route('staff.destroy', user.StaffID), {
                preserveScroll: true,
            });
        }
    };

    const handleApprovePasswordReset = (requestId) => {
        post(route('password-reset-request.approve', requestId), {
            preserveScroll: true,
        });
    };

    const handleRejectPasswordReset = (requestId) => {
        post(route('password-reset-request.reject', requestId), {
            preserveScroll: true,
        });
    };
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manage Staff" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* TOP BAR: Search, Filters & Add Button */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
                        
                        {/* Filter Group */}
                        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto flex-1">
                            
                            {/* Search Bar */}
                            <div className="relative w-full md:max-w-xs">
                                <input 
                                    type="text" 
                                    placeholder="Search Staff..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>

                            {/* Role Filter */}
                            <select 
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full md:w-48 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
                            >
                                <option value="">All Roles</option>
                                <option value="Manager">Manager</option>
                                <option value="Staff">Staff</option>
                            </select>

                            {/* Status Filter */}
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full md:w-48 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer"
                            >
                                <option value="">All Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        
                        {/* Add Button */}
                        <Link
                            href={route('register')}
                            className="w-full xl:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md flex justify-center items-center gap-2 transition-all transform hover:scale-[1.02]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span>Add Staff</span>
                        </Link>
                    </div>

                    {/* STAFF CARDS LIST */}
                    <div className="space-y-4">
                        {filteredStaff.length === 0 ? (
                            <div className="text-center text-gray-500 py-16 text-lg bg-white rounded-xl shadow-md border border-gray-100">
                                <p className="mb-2">No staff matching your filters.</p>
                                <button 
                                    onClick={() => {setSearchQuery(''); setRoleFilter(''); setStatusFilter('');}}
                                    className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            filteredStaff.map((user) => (
                                <div key={user.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col xl:flex-row justify-between xl:items-center gap-6 border border-gray-100 transition-all hover:shadow-md">
                                    
                                    {/* LEFT SIDE: Avatar -> ID -> Info */}
                                    <div className="flex items-center self-start gap-6 xl:self-auto">
                                        
                                        {/* 1. Avatar */}
                                        <img 
                                            src={`/storage/${user.profile_image}` || '/images/default-avatar.png'} 
                                            alt={user.Name}
                                            className="h-16 w-16 rounded-full object-cover border border-gray-200"
                                            onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + user.Name + '&background=EBF4FF&color=7F9CF5'; }}
                                        />

                                        {/* 2. ID Box */}
                                        <div className="h-14 w-16 bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">ID</span>
                                            <span className="text-lg font-bold text-blue-600">{user.StaffID}</span>
                                        </div>

                                        {/* 3. Name & Role */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-bold text-gray-800">{user.Name}</h3>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${
                                                    user.ActiveStatus === 1 
                                                        ? 'bg-green-100 text-green-700 border border-green-200' 
                                                        : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}>
                                                    {user.ActiveStatus === 1 ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="mt-1">
                                                 <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold border border-gray-200">
                                                    {user.Role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDE: Action Group */}
                                    {/* 'items-end' aligns buttons to bottom. 'gap-3' separates the groups. */}
                                    <div className="flex items-end gap-3 self-end xl:self-auto">
                                        
                                        {/* Logic: If Password Reset Request Exists */}
                                        {passwordResetRequests[user.StaffID] && (
                                            <div className="flex flex-col items-start gap-1 mr-2">
                                                <span className="text-blue-600 font-bold text-xs ml-0.5 self-center">
                                                    Password Reset Request
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprovePasswordReset(passwordResetRequests[user.StaffID].id)}
                                                        disabled={processing}
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-1.5 px-3 rounded shadow-sm text-sm transition-colors border border-transparent"
                                                    >
                                                        Approve Reset
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectPasswordReset(passwordResetRequests[user.StaffID].id)}
                                                        disabled={processing}
                                                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded shadow-sm text-sm transition-colors border border-transparent"
                                                    >
                                                        Reject Reset
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Edit Button - Reduced padding (py-1.5) to match the buttons above */}
                                        <Link
                                            href={route('staff.update', user.StaffID)}
                                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 font-medium py-1.5 px-4 rounded shadow-sm text-sm transition-colors flex items-center"
                                        >
                                            Edit
                                        </Link>

                                        {/* Delete Button */}
                                        <button 
                                            onClick={() => handleDelete(user)}
                                            className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors flex items-center justify-center"
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