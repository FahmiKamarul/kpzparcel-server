<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Get Counts
        $totalStaff = User::count(); 
        $totalParcels = Parcel::count();
         
        // Adjust 'Collected' string to match your DB exactly
        $collectedParcels = Parcel::where('Status', 'Collected')->count(); 
        $uncollectedParcels = $totalParcels - $collectedParcels;
        
        // 2. Calculate Income
        $totalIncome = Parcel::sum('Price');
    
        // 3. Prepare Chart Data (Mock data for now)
        $chartData = [
            'labels' => ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            'novSales' => [100, 300, 500, 200], 
            'decSales' => [150, 600, 350, 700], 
        ];
    
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalStaff' => $totalStaff,
                'totalParcels' => $totalParcels,
                'collected' => $collectedParcels,
                'uncollected' => $uncollectedParcels,
                'income' => $totalIncome,
            ],
            'chartData' => $chartData
        ]);
    }
}