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
            header={<></>} // Hide default header as per design
        >
            <Head title="Update Staff" />

            <div className="py-12 min-h-screen bg-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Top Search Bar (Visual Only) */}
                    <div className="mb-6">
                        <div className="relative w-full max-w-4xl mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Staff ID"
                                disabled // Start disabled as this is update page
                            />
                        </div>
                    </div>

                    {/* Main Form Container */}
                    <div className="bg-blue-300 rounded-lg p-8 max-w-4xl mx-auto shadow-sm">

                        <form onSubmit={submit} className="space-y-6">

                            {/* Staff ID Readonly */}
                            <div>
                                <input
                                    type="text"
                                    value={staff.StaffID}
                                    disabled
                                    className="block w-full rounded-md border-none shadow-sm focus:ring-0 bg-gray-100 text-gray-500"
                                    placeholder="Staff ID"
                                />
                            </div>

                            {/* Active Status Switch */}
                            <div className="flex items-center space-x-4">
                                <label className="font-bold text-gray-800">Active Status:</label>
                                <button
                                    type="button"
                                    onClick={() => setData('ActiveStatus', data.ActiveStatus == 1 ? 0 : 1)}
                                    className={`${data.ActiveStatus == 1 ? 'bg-purple-600' : 'bg-gray-200'
                                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2`}
                                >
                                    <span className="sr-only">Use setting</span>
                                    <span
                                        aria-hidden="true"
                                        className={`${data.ActiveStatus == 1 ? 'translate-x-5' : 'translate-x-0'
                                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                    />
                                </button>
                            </div>

                            {/* Name */}
                            <div>
                                <input
                                    type="text"
                                    value={data.Name}
                                    onChange={(e) => setData('Name', e.target.value)}
                                    placeholder="Name"
                                    className="block w-full rounded-md border-none shadow-sm focus:ring-0 bg-gray-100"
                                />
                                {errors.Name && <div className="text-red-500 text-sm mt-1">{errors.Name}</div>}
                            </div>

                            {/* Phone */}
                            <div>
                                <input
                                    type="text"
                                    value={data.PhoneNum}
                                    onChange={(e) => setData('PhoneNum', e.target.value)}
                                    placeholder="PhoneNum"
                                    className="block w-full rounded-md border-none shadow-sm focus:ring-0 bg-gray-100"
                                />
                                {errors.PhoneNum && <div className="text-red-500 text-sm mt-1">{errors.PhoneNum}</div>}
                            </div>

                            {/* Address */}
                            <div>
                                <input
                                    type="text"
                                    value={data.Address}
                                    onChange={(e) => setData('Address', e.target.value)}
                                    placeholder="Address"
                                    className="block w-full rounded-md border-none shadow-sm focus:ring-0 bg-gray-100"
                                />
                                {errors.Address && <div className="text-red-500 text-sm mt-1">{errors.Address}</div>}
                            </div>

                            {/* Role Dropdown */}
                            <div>
                                <div className="relative">
                                    <select
                                        value={data.Role}
                                        onChange={(e) => setData('Role', e.target.value)}
                                        className="block w-full rounded-md border-none shadow-sm focus:ring-0 bg-gray-100 appearance-none pr-10"
                                    >
                                        <option value="Staff">Staff</option>
                                        <option value="Manager">Manager</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                                {errors.Role && <div className="text-red-500 text-sm mt-1">{errors.Role}</div>}
                            </div>

                            {/* Update Button */}
                            <div className="flex justify-center pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-12 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Update
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}