<?php

namespace App\Http\Controllers;

use App\Models\User;           // <--- Import User Model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;           // <--- YOU ARE MISSING THIS LINE
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
class StaffController extends Controller
{
    public function index(): Response
    {
        // Fetch all users, latest first
        $staffList = User::latest()->get(); 

        return Inertia::render('Staff/ManageStaff', [
            'staffList' => $staffList
        ]);
    }
    public function destroy(User $user)
    {
        $user->delete();
        
        return redirect()->back()->with('message', 'Staff deleted successfully');
    }
    public function update(User $user): Response
    {
        return Inertia::render('Staff/Update', [
            'staff' => $user
        ]);
    }

    // 2. Handle the Update Logic
    public function edit(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'Name' => 'required|string|max:255',
            'PhoneNum' => 'required|string|max:20',
            'Address' => 'required|string|max:255',
            'Role' => 'required|in:Manager,Staff', // Ensure valid roles
            'ActiveStatus' => 'required|boolean',  // 1 or 0
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload if provided
        if ($request->hasFile('profile_image')) {
            // Delete old image if it exists
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            // Store new image in profile folder
            $validated['profile_image'] = $request->file('profile_image')->store('profile', 'public');
        } else {
            // If no image is uploaded, remove it from the validated data so it doesn't overwrite the existing image
            unset($validated['profile_image']);
        }

        // Update the user
        $user->update($validated);

        // Redirect back to the list with a success message
        return redirect()->route('staff.manage')->with('message', 'Staff details updated successfully!');
    }
}