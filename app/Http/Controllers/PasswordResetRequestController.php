<?php

namespace App\Http\Controllers;

use App\Models\PasswordResetRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetRequestController extends Controller
{
    /**
     * Show the form for requesting a password reset
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ResetPassword');
    }

    /**
     * Store a new password reset request
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'StaffID' => 'required|exists:users,StaffID',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::find($request->StaffID);
        if (!$user) {
            throw ValidationException::withMessages([
                'StaffID' => ['Staff ID not found.'],
            ]);
        }

        // Create a new pending password reset request
        PasswordResetRequest::create([
            'StaffID' => $request->StaffID,
            'new_password' => Hash::make($request->password),
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        return redirect()->route('login')->with('status', 'Password reset request submitted. Please wait for manager approval.');
    }

    /**
     * Show pending reset requests for managers
     */
    public function index(): Response
    {
        // Only managers can view and approve requests
        if (Auth::user()->Role !== 'Manager') {
            abort(403, 'Unauthorized action.');
        }

        $requests = PasswordResetRequest::with('user')
            ->where('status', 'pending')
            ->orderBy('requested_at', 'desc')
            ->get();

        return Inertia::render('PasswordResetRequests/Index', [
            'requests' => $requests,
        ]);
    }

    /**
     * Approve a password reset request
     */
    public function approve(PasswordResetRequest $passwordResetRequest): RedirectResponse
    {
        // Only managers can approve
        if (Auth::user()->Role !== 'Manager') {
            abort(403, 'Unauthorized action.');
        }

        $user = User::find($passwordResetRequest->StaffID);
        if (!$user) {
            return back()->with('error', 'User not found.');
        }

        try {
            // Update user's password directly
            $updated = DB::table('users')
                ->where('StaffID', $passwordResetRequest->StaffID)
                ->update(['Password' => $passwordResetRequest->new_password]);

            if ($updated === 0) {
                return back()->with('error', 'Failed to update password.');
            }

            // Delete the password reset request after approval
            $passwordResetRequest->delete();

            return back()->with('success', "Password reset approved for {$user->Name}.");
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Reject a password reset request
     */
    public function reject(Request $request, PasswordResetRequest $resetRequest): RedirectResponse
    {
        // Only managers can reject
        if (Auth::user()->Role !== 'Manager') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'rejection_reason' => 'nullable|string|max:500',
        ]);

        $user = User::find($resetRequest->StaffID);
        if (!$user) {
            return back()->with('error', 'User not found.');
        }

        try {
            // Delete the password reset request directly from database
            DB::table('password_reset_requests')
                ->where('id', $resetRequest->id)
                ->delete();

            return back()->with('success', "Password reset rejected for {$user->Name}.");
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Show history of password reset requests
     */
    public function history(): Response
    {
        // Only managers can view history
        if (Auth::user()->Role !== 'Manager') {
            abort(403, 'Unauthorized action.');
        }

        $requests = PasswordResetRequest::with('user', 'approver')
            ->whereIn('status', ['approved', 'rejected'])
            ->orderBy('reviewed_at', 'desc')
            ->paginate(20);

        return Inertia::render('PasswordResetRequests/History', [
            'requests' => $requests,
        ]);
    }
}
