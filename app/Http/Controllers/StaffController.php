<?php

namespace App\Http\Controllers;

use App\Models\User;           // <--- Import User Model
use Illuminate\Http\Request;
use Inertia\Inertia;           // <--- YOU ARE MISSING THIS LINE
use Inertia\Response;

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
}