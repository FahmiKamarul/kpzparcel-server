<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // 1. Determine Start and End dates
        $startDate = $request->input('start_date') 
            ? Carbon::parse($request->input('start_date'))->startOfDay() 
            : Carbon::now()->startOfMonth();

        $endDate = $request->input('end_date') 
            ? Carbon::parse($request->input('end_date'))->endOfDay() 
            : Carbon::now()->endOfMonth();

        // 2. Base Query
        $baseQuery = Parcel::whereBetween('DateArrive', [$startDate, $endDate]);
        
        // 3. Stats Calculations
        $totalParcels = (clone $baseQuery)->count();
        $collectedParcels = (clone $baseQuery)->where('Status', 'Collected')->count();
        $uncollectedParcels = $totalParcels - $collectedParcels;
        $totalIncome = (clone $baseQuery)->sum('Price');

        $lateParcels = Payment::whereBetween('PaymentDate', [$startDate, $endDate])
            ->where('PaymentPenalty', '>', 0)
            ->count();

        $totalStaff = User::count(); 

        // 4. NEW: Disposal List (Status 'Ready' AND > 14 Days old)
        // We don't filter this by the date range selected, because old parcels might be from last month
        // We just want ANY parcel currently in the system that is old.
        $disposalList = Parcel::where('Status', 'Ready')
            ->where('DateArrive', '<=', Carbon::now()->subDays(14))
            ->orderBy('DateArrive', 'asc') // Oldest first
            ->get(['TrackingNum', 'CustomerName', 'ShelfNum', 'DateArrive']);

        // 5. Chart Data
        $dailySales = (clone $baseQuery)
            ->select(DB::raw('DATE(DateArrive) as date'), DB::raw('SUM(Price) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $labels = $dailySales->pluck('date')->map(fn($date) => Carbon::parse($date)->format('d M'));
        $data = $dailySales->pluck('total');

        return Inertia::render('Dashboard', [
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
            'stats' => [
                'totalStaff' => $totalStaff,
                'totalParcels' => $totalParcels,
                'collected' => $collectedParcels,
                'uncollected' => $uncollectedParcels,
                'late' => $lateParcels,
                'income' => number_format($totalIncome, 2),
            ],
            'disposalList' => $disposalList, // <--- Passing the list to Frontend
            'chartData' => [
                'labels' => $labels,
                'label' => 'Sales (' . $startDate->format('d M') . ' - ' . $endDate->format('d M') . ')',
                'data' => $data,
            ]
        ]);
    }
}