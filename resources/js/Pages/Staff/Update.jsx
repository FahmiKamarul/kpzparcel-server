import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Update({ auth, staff }) {

    // Initialize form with existing staff data
    const { data, setData, processing, errors } = useForm({
        Name: staff.Name,
        PhoneNum: staff.PhoneNum,
        Address: staff.Address,
        Role: staff.Role,
        ActiveStatus: staff.ActiveStatus ? 1 : 0,
        profile_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        // Send PATCH request to update - router.post with _method works for file uploads
        router.post(route('staff.edit', staff.StaffID), 
            {
                ...data,
                _method: 'PATCH',
            },
            {
                preserveScroll: true,
                forceFormData: true,
            }
        );
    };

    return (
    <AuthenticatedLayout
        user={auth.user}
        header={<></>} // Hide default header as per design
    >
        <Head title="Update Staff" />

        {/* Outer Container: Light Gray Background */}
        <div className="py-12 min-h-screen bg-gray-50"> 
            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                {/* --- 1. HEADER & STAFF ID DISPLAY --- */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Update Staff Details</h1>
                    
                    {/* Staff ID Badge (Prominent, Read-Only Context) */}
                    <div className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full tracking-wider shadow-inner">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-5 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6"></path></svg>
                        STAFF ID: <span className="ml-1 font-bold text-lg">{staff.StaffID}</span>
                    </div>
                </div>

                {/* --- 2. MAIN FORM CONTAINER: White Card --- */}
                <div className="bg-white p-8 lg:p-10 rounded-xl shadow-2xl border border-gray-100">

                    <form onSubmit={submit} className="space-y-8">

                        {/* --- BASIC INFORMATION GROUP --- */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">Personal Information</h2>

                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.Name}
                                    onChange={(e) => setData('Name', e.target.value)}
                                    placeholder="Enter staff full name"
                                    // High-UX Input Style: Light gray background, blue focus ring, rounded
                                    className="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                />
                                {errors.Name && <div className="text-red-500 text-sm mt-1">{errors.Name}</div>}
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={data.PhoneNum}
                                    onChange={(e) => setData('PhoneNum', e.target.value)}
                                    placeholder="e.g., 012-3456789"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                />
                                {errors.PhoneNum && <div className="text-red-500 text-sm mt-1">{errors.PhoneNum}</div>}
                            </div>

                            {/* Address Input */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={data.Address}
                                    onChange={(e) => setData('Address', e.target.value)}
                                    placeholder="Street, City, Postcode"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                />
                                {errors.Address && <div className="text-red-500 text-sm mt-1">{errors.Address}</div>}
                            </div>
                        </div>

                        {/* --- ROLE & STATUS GROUP --- */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">Role & System Status</h2>

                            {/* Role Dropdown */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Assigned Role</label>
                                <div className="relative">
                                    <select
                                        id="role"
                                        value={data.Role}
                                        onChange={(e) => setData('Role', e.target.value)}
                                        // Standardized input style for select
                                        className="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 appearance-none pr-10 transition duration-150"
                                    >
                                        <option value="Staff">Staff</option>
                                        <option value="Manager">Manager</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                        <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                                {errors.Role && <div className="text-red-500 text-sm mt-1">{errors.Role}</div>}
                            </div>


                            {/* Profile Image Upload */}
                            <div>
                                <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                                {staff.profile_image && (
                                    <div className="mb-3 flex items-center">
                                        <img 
                                            src={`/storage/${staff.profile_image}`} 
                                            alt="Current Profile" 
                                            className="w-16 h-16 rounded-lg object-cover mr-3"
                                        />
                                        <p className="text-sm text-gray-600">Current image</p>
                                    </div>
                                )}
                                <input
                                    id="profile_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('profile_image', e.target.files[0])}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                />
                                <p className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF (max 2MB). Leave empty to keep current image.</p>
                                {errors.profile_image && <div className="text-red-500 text-sm mt-1">{errors.profile_image}</div>}
                            </div>
                        </div>

                        {/* --- ROLE & STATUS GROUP --- */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">System Status</h2>

                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-inner">
                                <label className="text-base font-semibold text-gray-800 flex-grow">
                                    Active Status
                                    <span className="block text-sm font-normal text-gray-500">Toggle to enable or disable staff access.</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setData('ActiveStatus', data.ActiveStatus == 1 ? 0 : 1)}
                                    // Use Green for Active, Gray for Inactive
                                    className={`${data.ActiveStatus == 1 ? 'bg-green-500' : 'bg-gray-300'
                                        } relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
                                >
                                    <span className="sr-only">Toggle Active Status</span>
                                    {/* Handle & Visual Status Label */}
                                    <span
                                        aria-hidden="true"
                                        className={`${data.ActiveStatus == 1 ? 'translate-x-7' : 'translate-x-0'
                                            } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center`}
                                    >
                                        {data.ActiveStatus == 1 ? (
                                            <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>


                        {/* --- SUBMIT BUTTON --- */}
                        <div className="flex justify-center pt-8">
                            <Link
                                    href={route('staff.manage')} // Replace with the actual route to your staff list/previous page
                                    className="px-8 py-3 mr-4 bg-gray-300 text-gray-700 font-semibold text-lg rounded-full shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Cancel
                                </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                // The main call-to-action button
                                className="px-16 py-3 bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                {processing ? 'SAVING...' : 'SAVE CHANGES'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
);
}