import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Update({ auth, staff }) {
    
    // Initialize form with existing staff data
    const { data, setData, patch, processing, errors } = useForm({
        Name: staff.Name,
        PhoneNum: staff.PhoneNum,
        Address: staff.Address,
        Role: staff.Role,
        ActiveStatus: staff.ActiveStatus,
    });

    const submit = (e) => {
        e.preventDefault();
        // Send PATCH request to update
        patch(route('staff.edit', staff.StaffID));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-white">Update Staff: {staff.StaffID}</h2>}
        >
            <Head title="Update Staff" />

            <div className="py-12 bg-gray-100 min-h-screen">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-8 shadow-sm rounded-lg border border-gray-200">
                        
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Name */}
                            <div>
                                <label className="block font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    value={data.Name}
                                    onChange={(e) => setData('Name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.Name && <div className="text-red-500 text-sm mt-1">{errors.Name}</div>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    value={data.PhoneNum}
                                    onChange={(e) => setData('PhoneNum', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.PhoneNum && <div className="text-red-500 text-sm mt-1">{errors.PhoneNum}</div>}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block font-medium text-gray-700">Address</label>
                                <textarea
                                    value={data.Address}
                                    onChange={(e) => setData('Address', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.Address && <div className="text-red-500 text-sm mt-1">{errors.Address}</div>}
                            </div>

                            {/* Role Dropdown */}
                            <div>
                                <label className="block font-medium text-gray-700">Role</label>
                                <select
                                    value={data.Role}
                                    onChange={(e) => setData('Role', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Staff">Staff</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>

                            {/* Active Status Toggle */}
                            <div className="flex items-center gap-4 border p-4 rounded bg-gray-50">
                                <label className="font-medium text-gray-700">Account Status:</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="status" 
                                            value={1}
                                            checked={data.ActiveStatus == 1} 
                                            onChange={() => setData('ActiveStatus', 1)}
                                            className="mr-2"
                                        />
                                        <span className="text-green-600 font-bold">Active</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="status" 
                                            value={0}
                                            checked={data.ActiveStatus == 0} 
                                            onChange={() => setData('ActiveStatus', 0)}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-500 font-bold">Inactive</span>
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <Link
                                    href={route('staff.manage')}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}