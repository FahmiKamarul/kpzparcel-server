import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        StaffID: '',
        Password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('Password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen bg-white flex flex-col">

                {/* Header */}
                <header className="bg-blue-500 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">

                            {/* Logo / Title */}
                            <div className="flex-shrink-0">
                                <h1 className="text-white text-2xl font-bold leading-tight text-center sm:text-left">
                                    KPZ Parcel Management<br />System
                                </h1>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center space-x-6">
                                <Link
                                    href="/"
                                    className="text-white text-lg font-semibold hover:text-gray-200"
                                >
                                    Parcel
                                </Link>
                                <div className="h-8 w-px bg-blue-300 mx-2"></div>
                                <Link
                                    href={route('login')}
                                    className="text-white text-lg font-semibold hover:text-gray-200 flex items-center gap-2"
                                >
                                    Login <span className="text-xl">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow flex flex-col items-center justify-center p-4">

                    {/* Parcel Icon Placeholder */}
                    <div className="mb-8">
                        {/* Box Icon Placeholder */}
                        <div className="w-48 h-48 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                            <span className="text-9xl">📦</span>
                        </div>
                    </div>

                    <form onSubmit={submit} className="w-full max-w-lg flex flex-col items-center gap-6">

                        {/* StaffID Input */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                name="StaffID"
                                value={data.StaffID}
                                onChange={(e) => setData('StaffID', e.target.value)}
                                placeholder="StaffID"
                                className="w-full py-3.5 pl-6 pr-12 bg-gray-100 border-none rounded-full text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 shadow-sm text-center"
                                autoComplete="StaffID"
                                autoFocus
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        {errors.StaffID && <div className="text-red-500 text-sm">{errors.StaffID}</div>}

                        {/* Password Input */}
                        <div className="relative w-full">
                            <input
                                type="password"
                                name="Password"
                                value={data.Password}
                                onChange={(e) => setData('Password', e.target.value)}
                                placeholder="Password"
                                className="w-full py-3.5 pl-6 pr-12 bg-gray-100 border-none rounded-full text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 shadow-sm text-center"
                                autoComplete="current-password"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        {errors.Password && <div className="text-red-500 text-sm">{errors.Password}</div>}

                        {canResetPassword && (
                            <div className="w-full text-right px-4">
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-gray-500 hover:text-blue-500 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-24 rounded-full shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1 mt-4"
                        >
                            Login
                        </button>

                    </form>
                </main>
            </div>
        </>
    );
}