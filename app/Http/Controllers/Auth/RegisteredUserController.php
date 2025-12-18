<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    
    
    public function store(Request $request): RedirectResponse
    {

        $request->validate([
            'Name' => 'required|string|max:255',
            'PhoneNum' => 'required|string|max:20',
            'Address' => 'required|string|max:255',
            'Role' => 'required|string|max:50',
            'Password' => ['required', 'confirmed', Rules\Password::defaults()],
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Generate next StaffID
        $newStaffID = $this->generateNextStaffID();

        $profileImagePath = null;
        
        // Handle image upload if provided
        if ($request->hasFile('profile_image')) {
            $profileImagePath = $request->file('profile_image')->store('profile', 'public');
        }

        $user = User::create([
            'StaffID' => $newStaffID,
            'Name' => $request->Name,
            'PhoneNum' => $request->PhoneNum,
            'Address' => $request->Address,
            'Role' => $request->Role,
            'Password' => Hash::make($request->Password),
            'profile_image' => $profileImagePath,
            'ActiveStatus' => true,
        ]);

        event(new Registered($user));

        return redirect(route('dashboard', absolute: false));
    }
    public function create(): Response
    {

        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    
    private function generateNextStaffID(): string
    {
        $lastUser = User::selectRaw("CAST(SUBSTRING(StaffID, 2) AS UNSIGNED) as numeric_id")
            ->orderByDesc('numeric_id')
            ->first();
        
        $nextId = 101;
        
        if ($lastUser) {
            $nextId = $lastUser->numeric_id + 1;
        }
        
        return 'S' . $nextId;
    }

    public function getNextId(): JsonResponse
    {
        return response()->json([
            'next_id' => $this->generateNextStaffID(),
        ]);
    }
}
