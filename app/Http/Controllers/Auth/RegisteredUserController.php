<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
            'StaffID' => 'required|string|max:255|unique:users',
            'Name' => 'required|string|max:255',
            'PhoneNum' => 'required|string|max:20',
            'Address' => 'required|string|max:255',
            'Role' => 'required|string|max:50',
            'Password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'StaffID' => $request->StaffID,
            'Name' => $request->Name,
            'PhoneNum' => $request->PhoneNum,
            'Address' => $request->Address,
            'Role' => $request->Role,
            'Password' => Hash::make($request->Password),
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
    
}
