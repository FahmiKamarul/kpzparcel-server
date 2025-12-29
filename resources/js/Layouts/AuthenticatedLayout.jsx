import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-500 border-b border-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20"> {/* Increased height slightly */}
                        <div className="flex items-center">
                            {/* Logo / Title */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <h1 className="text-white text-xl font-bold leading-tight">
                                        KPZ Parcel Management System
                                    </h1>
                                </Link>
                            </div>
                        </div>

                        {/* Center Links */}
                        <div className="hidden sm:flex sm:items-center sm:space-x-8">
                            {user && (
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="text-white text-lg font-semibold hover:text-gray-200 border-b-2 border-transparent hover:border-white focus:border-white"
                                >
                                    Home
                                </NavLink>
                            )}
                            {user && user.Role === 'Manager' && (
                                <NavLink
                                    href={route('staff.manage')}
                                    active={route().current('staff.manage')}
                                    className="text-white text-lg font-semibold hover:text-gray-200 border-b-2 border-transparent hover:border-white focus:border-white"
                                >
                                    Staff
                                </NavLink>
                            )}
                            {user && (
                                <NavLink
                                    href={route('parcels.manage')}
                                    active={route().current('parcels.manage')}
                                    className="text-white text-lg font-semibold hover:text-gray-200 border-b-2 border-transparent hover:border-white focus:border-white"
                                >
                                    Parcel
                                </NavLink>
                            )}
                        </div>

                        {/* Right User Profile */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {user ? (
                                <div className="ml-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white hover:text-gray-200 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    <div className="text-right mr-2">
                                                        <div className="text-xs font-bold uppercase">{user.StaffID}</div>
                                                        <div className="text-base font-bold">{user.Name}</div>
                                                    </div>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            {/*<Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>*/}
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="text-white text-lg font-semibold hover:text-gray-200 flex items-center gap-2"
                                >
                                    Staff Login <span className="text-xl">&rarr;</span>
                                </Link>
                            )}
                        </div>

                        {/* Hamburger */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 focus:text-white transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {user && (
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Dashboard
                            </ResponsiveNavLink>
                        )}
                        {user && user.Role === 'Manager' && (
                            <ResponsiveNavLink href={route('staff.manage')} active={route().current('staff.manage')}>
                                Staff
                            </ResponsiveNavLink>
                        )}
                        {user && (
                            <ResponsiveNavLink href={route('parcels.manage')} active={route().current('parcels.manage')}>
                                Parcel
                            </ResponsiveNavLink>
                        )}
                    </div>

                    {user && (
                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">
                                    {user.Name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user.StaffID}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                {/* <ResponsiveNavLink href={route('profile.edit')}>
                                    Profile
                                </ResponsiveNavLink> */}
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
