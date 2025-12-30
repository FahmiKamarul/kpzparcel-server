<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;         
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
class StaffController extends Controller
{
    public function index(): Response
    {

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


    public function edit(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'Name' => 'required|string|max:255',
            'PhoneNum' => 'required|string|max:20',
            'Address' => 'required|string|max:255',
            'Role' => 'required|in:Manager,Staff', 
            'ActiveStatus' => 'required|boolean',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);


        if ($request->hasFile('profile_image')) {

            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }

            $validated['profile_image'] = $request->file('profile_image')->store('profile', 'public');
        } else {

            unset($validated['profile_image']);
        }


        $user->update($validated);

        return redirect()->route('staff.manage')->with('message', 'Staff details updated successfully!');
    }
}