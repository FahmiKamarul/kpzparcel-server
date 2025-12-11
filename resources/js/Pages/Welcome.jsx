import { Head, Link, useForm } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        TrackingNum: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('parcel.track'));
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-white flex flex-col">

                {/* Header */}
                <header className="bg-blue-500 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">

                            {/* Logo / Title */}
                            <div className="flex-shrink-0">
                                <h1 className="text-white text-2xl font-bold leading-tight text-center sm:text-left">
                                    KPZ Parcel Management System
                                </h1>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center space-x-6">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-white text-lg font-semibold hover:text-gray-200 flex items-center gap-2"
                                    >
                                        Dashboard <span className="text-xl">&rarr;</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="text-white text-lg font-semibold hover:text-gray-200 flex items-center gap-2"
                                    >
                                        Staff Login <span className="text-xl">&rarr;</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow flex flex-col items-center justify-center p-4">

                    {/* Parcel Link / Icon Placeholder */}
                    <div className="mb-8">
                        {/* 
                            Using a high-quality SVG/Image placeholder here. 
                            Ideally, you would replace this with: <img src="/images/box.png" className="w-48 h-48 object-contain" />
                        */}
                        <div className="w-48 h-48 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                            <span className="text-9xl">📦</span>
                        </div>
                    </div>

                    <h2 className="text-gray-800 font-semibold mb-6">Please Enter Your Tracking Number</h2>

                    <form onSubmit={submit} className="w-full max-w-2xl flex flex-col items-center gap-6">

                        {/* Search Input Bar */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                name="TrackingNum"
                                value={data.TrackingNum}
                                onChange={(e) => setData('TrackingNum', e.target.value)}
                                placeholder="Tracking Number"
                                className="w-full py-4 pl-6 pr-12 bg-gray-100 border-none rounded-full text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 shadow-sm text-center"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        {errors.TrackingNum && <div className="text-red-500 text-sm">{errors.TrackingNum}</div>}

                        {/* Search Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-16 rounded-full shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1"
                        >
                            Search
                        </button>

                    </form>
                </main>
            </div>
        </>
    );
}
