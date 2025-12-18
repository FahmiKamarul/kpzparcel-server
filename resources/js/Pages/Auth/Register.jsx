import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Register() {
    const [nextStaffId, setNextStaffId] = useState(null);

    // Fetch the next StaffID when component mounts
    useEffect(() => {
        fetch(route('register.next-id'))
            .then(res => res.json())
            .then(data => setNextStaffId(data.next_id))
            .catch(err => console.error('Error fetching next ID:', err));
    }, []);

    // 1. Updated state to match your Database Columns exactly
    const { data, setData, post, processing, errors, reset } = useForm({
        Name: '',
        PhoneNum: '',
        Address: '',
        Role: '',
        Password: '',
        Password_confirmation: '',
        profile_image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('Password', 'Password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50"> 
            
            <Head title="Register Staff" />

            {/* 1. HEADER - FULL WIDTH */}
            <header className="bg-blue-600 shadow-xl"> 
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo / Title */}
                        <div className="flex-shrink-0">
                            <h1 className="text-white text-xl font-bold">
                                KPZ Parcel Management System
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. MAIN CONTENT - CENTERED FORM */}
            <div className="py-12 flex items-center justify-center">
                
                <div className="max-w-xl w-full mx-auto">
                    
                    {/* --- Form Header (Below main site header) --- */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Register New Staff</h1>
                        <p className="text-gray-500 text-md">Enter the required details to create a new staff account.</p>
                        {nextStaffId && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    Staff ID will be assigned as: <span className="font-bold text-blue-600 text-lg">{nextStaffId}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* --- 3. MAIN FORM CONTAINER: White Card --- */}
                    <div className="bg-white p-8 lg:p-10 rounded-xl shadow-2xl border border-gray-100">

                        <form onSubmit={submit} className="space-y-6">

                            {/* --- BASIC INFORMATION GROUP --- */}
                            <div className="space-y-5 border-b pb-6">
                                <h2 className="text-xl font-bold text-gray-700">Personal & Contact Info</h2>

                                {/* Name Input */}
                                <div>
                                    <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <TextInput
                                        id="Name"
                                        name="Name"
                                        value={data.Name}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                        autoComplete="name"
                                        onChange={(e) => setData('Name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.Name} className="mt-2" />
                                </div>

                                {/* PhoneNum Input */}
                                <div>
                                    <label htmlFor="PhoneNum" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <TextInput
                                        id="PhoneNum"
                                        name="PhoneNum"
                                        value={data.PhoneNum}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                        onChange={(e) => setData('PhoneNum', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.PhoneNum} className="mt-2" />
                                </div>

                                {/* Address Input */}
                                <div>
                                    <label htmlFor="Address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <TextInput
                                        id="Address"
                                        name="Address"
                                        value={data.Address}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                        onChange={(e) => setData('Address', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.Address} className="mt-2" />
                                </div>

                                {/* Role Dropdown (with Placeholder) */}
                                <div>
                                    <label htmlFor="Role" className="block text-sm font-medium text-gray-700 mb-1">Assigned Role</label>
                                    <div className="relative">
                                        <select
                                            id="Role"
                                            name="Role"
                                            value={data.Role}
                                            onChange={(e) => setData('Role', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 appearance-none pr-10 transition duration-150"
                                            required
                                        >
                                            <option value="" disabled hidden>Select a Role</option>
                                            <option value="Staff">Staff</option>
                                            <option value="Manager">Manager</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                    <InputError message={errors.Role} className="mt-2" />
                                </div>

                                {/* Profile Image Upload */}
                                <div>
                                    <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                                    <input
                                        id="profile_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('profile_image', e.target.files[0])}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF (max 2MB)</p>
                                    <InputError message={errors.profile_image} className="mt-2" />
                                </div>
                            </div>


                            {/* --- SECURITY GROUP --- */}
                            <div className="space-y-5 pt-4">
                                <h2 className="text-xl font-bold text-gray-700">Security & Credentials</h2>

                                {/* Password Input */}
                                <div>
                                    <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <TextInput
                                        id="Password"
                                        type="password"
                                        name="Password"
                                        value={data.Password}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('Password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.Password} className="mt-2" />
                                </div>

                                {/* Confirm Password Input */}
                                <div>
                                    <label htmlFor="Password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <TextInput
                                        id="Password_confirmation"
                                        type="password"
                                        name="Password_confirmation"
                                        value={data.Password_confirmation}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('Password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.Password_confirmation} className="mt-2" />
                                </div>
                            </div>

                            {/* --- ACTIONS --- */}
                            <div className="flex items-center justify-between pt-6">
                                
                                {/* 1. Cancel/Back Button (Grey) */}
                                <Link
                                    href={route('staff.manage')} // Replace with the actual route to your staff list/previous page
                                    className="px-8 py-3 mr-4 bg-gray-300 text-gray-700 font-semibold text-lg rounded-full shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Cancel
                                </Link>

                                <div className="flex items-center">
                                    {/* Already Registered Link 
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors underline mr-4"
                                    >
                                        Already registered?
                                    </Link> */}

                                    {/* 2. Register Button (Primary) */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200"
                                    >
                                        {processing ? 'REGISTERING...' : 'REGISTER STAFF'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}