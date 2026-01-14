import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function History({ requests, auth }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Password Reset History</h2>}
        >
            <Head title="Password Reset History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {requests.data.length === 0 ? (
                                <p className="text-gray-500">No password reset history available.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-semibold">Staff ID</th>
                                                <th className="px-6 py-3 text-left font-semibold">Name</th>
                                                <th className="px-6 py-3 text-left font-semibold">Status</th>
                                                <th className="px-6 py-3 text-left font-semibold">Requested At</th>
                                                <th className="px-6 py-3 text-left font-semibold">Reviewed At</th>
                                                <th className="px-6 py-3 text-left font-semibold">Reviewed By</th>
                                                <th className="px-6 py-3 text-left font-semibold">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.data.map((request) => (
                                                <tr key={request.id} className="border-t hover:bg-gray-50">
                                                    <td className="px-6 py-4">{request.StaffID}</td>
                                                    <td className="px-6 py-4">{request.user.Name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">{formatDate(request.requested_at)}</td>
                                                    <td className="px-6 py-4 text-sm">{request.reviewed_at ? formatDate(request.reviewed_at) : '-'}</td>
                                                    <td className="px-6 py-4 text-sm">{request.approver?.Name || '-'}</td>
                                                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                                                        {request.rejection_reason || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {requests.links && requests.links.length > 0 && (
                                <div className="mt-4 flex justify-between items-center">
                                    {/* Add pagination component here if needed */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
