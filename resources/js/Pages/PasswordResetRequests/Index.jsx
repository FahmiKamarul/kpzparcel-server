import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';

export default function Index({ requests, auth }) {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const approveForm = useForm({});
    const rejectForm = useForm({
        rejection_reason: '',
    });

    const handleApprove = (requestId) => {
        approveForm.post(route('password-reset-request.approve', requestId), {
            onSuccess: () => {
                setSelectedRequest(null);
            },
        });
    };

    const handleRejectClick = (request) => {
        setSelectedRequest(request);
        setRejectModalOpen(true);
        setRejectionReason('');
    };

    const handleRejectSubmit = (requestId) => {
        rejectForm.post(
            route('password-reset-request.reject', requestId),
            {
                onSuccess: () => {
                    setRejectModalOpen(false);
                    setSelectedRequest(null);
                    setRejectionReason('');
                },
            }
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Password Reset Requests</h2>}
        >
            <Head title="Password Reset Requests" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {requests.length === 0 ? (
                                <p className="text-gray-500">No pending password reset requests.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-semibold">Staff ID</th>
                                                <th className="px-6 py-3 text-left font-semibold">Name</th>
                                                <th className="px-6 py-3 text-left font-semibold">Role</th>
                                                <th className="px-6 py-3 text-left font-semibold">Requested At</th>
                                                <th className="px-6 py-3 text-left font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map((request) => (
                                                <tr key={request.id} className="border-t hover:bg-gray-50">
                                                    <td className="px-6 py-4">{request.StaffID}</td>
                                                    <td className="px-6 py-4">{request.user.Name}</td>
                                                    <td className="px-6 py-4">{request.user.Role}</td>
                                                    <td className="px-6 py-4">{formatDate(request.requested_at)}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <PrimaryButton
                                                                size="sm"
                                                                onClick={() => handleApprove(request.id)}
                                                                disabled={approveForm.processing}
                                                            >
                                                                Approve
                                                            </PrimaryButton>
                                                            <DangerButton
                                                                size="sm"
                                                                onClick={() => handleRejectClick(request)}
                                                                disabled={rejectForm.processing}
                                                            >
                                                                Reject
                                                            </DangerButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Reject Password Reset Request
                    </h3>
                    {selectedRequest && (
                        <p className="mt-2 text-sm text-gray-600">
                            For: <strong>{selectedRequest.user.Name}</strong> (Staff ID: {selectedRequest.StaffID})
                        </p>
                    )}

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason (Optional)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            rows="4"
                            value={rejectForm.data.rejection_reason}
                            onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                            placeholder="Explain why you're rejecting this request..."
                        ></textarea>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setRejectModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <DangerButton
                            onClick={() => handleRejectSubmit(selectedRequest.id)}
                            disabled={rejectForm.processing}
                        >
                            Reject Request
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
