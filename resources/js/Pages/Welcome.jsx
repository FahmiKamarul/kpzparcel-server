import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Welcome({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        TrackingNum: '',
    });
    const user = usePage().props.auth.user;
    const submit = (e) => {
        e.preventDefault();
        post(route('parcel.track'));
    };

    return (
        <>
            <Head title="Welcome" />
            
            {/* 1. Added 'min-h-screen' (or min-h-[calc(100vh-5rem)] to avoid scrollbars) 
                to ensure the white background fills the screen.
                2. Added 'justify-center' to vertically center the content.
            */}
            <div className="bg-white flex flex-col items-center justify-center p-4 min-h-[calc(100vh-4.5rem)]">

                {/* Main Content Wrapper */}
                <div className="w-full flex flex-col items-center">

                    {/* Parcel Link / Icon Placeholder */}
                    <div className="mb-8">
                        {/* Box Icon Placeholder */}
                        <div className="w-48 h-48 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                            <span className="text-9xl">📦</span>
                        </div>
                    </div>

                    <h2 className="text-gray-800 font-bold text-2xl mb-2">Track Your Parcel</h2>
                    <p className="text-gray-500 mb-8">Please enter your tracking number below</p>

                    <form onSubmit={submit} className="w-full max-w-2xl flex flex-col items-center gap-6">

                        {/* Search Input Bar */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                name="TrackingNum"
                                value={data.TrackingNum}
                                onChange={(e) => setData('TrackingNum', e.target.value)}
                                placeholder="Enter Tracking Number"
                                className="w-full py-4 pl-6 pr-12 bg-gray-50 border border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm text-center text-lg transition-all"
                            />
                            <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        {errors.TrackingNum && <div className="text-red-500 text-sm font-medium">{errors.TrackingNum}</div>}

                        {/* Search Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-16 rounded-full shadow-lg hover:shadow-xl transition duration-200 ease-in-out transform hover:-translate-y-1 w-full sm:w-auto"
                        >
                            {processing ? 'Searching...' : 'Search Parcel'}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}

Welcome.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;