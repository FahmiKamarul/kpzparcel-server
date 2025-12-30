<?php

namespace App\Http\Controllers;

use App\Models\Parcel;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {

        $filterDate = $request->input('date') 
            ? Carbon::createFromFormat('Y-m', $request->input('date')) 
            : Carbon::now();

        $month = $filterDate->month;
        $year = $filterDate->year;
        $monthName = $filterDate->format('F Y');

        $baseQuery = Parcel::whereYear('DateArrive', $year)->whereMonth('DateArrive', $month);
        
        $totalParcels = (clone $baseQuery)->count();
        $collectedParcels = (clone $baseQuery)->where('Status', 'Collected')->count();
        $uncollectedParcels = $totalParcels - $collectedParcels;
        $totalIncome = (clone $baseQuery)->sum('Price');
        

        $totalStaff = User::count(); 


        $weeklySales = [0, 0, 0, 0];

        $parcels = (clone $baseQuery)->get(['DateArrive', 'Price']);

        foreach ($parcels as $parcel) {
            if (!$parcel->DateArrive) continue;
            
            $day = Carbon::parse($parcel->DateArrive)->day;


            if ($day <= 7) {
                $weeklySales[0] += $parcel->Price;
            } elseif ($day <= 14) {
                $weeklySales[1] += $parcel->Price;
            } elseif ($day <= 21) {
                $weeklySales[2] += $parcel->Price;
            } else {
                $weeklySales[3] += $parcel->Price;
            }
        }


        return Inertia::render('Dashboard', [

            'filters' => [
                'date' => $filterDate->format('Y-m'),
            ],
            'stats' => [
                'totalStaff' => $totalStaff,
                'totalParcels' => $totalParcels,
                'collected' => $collectedParcels,
                'uncollected' => $uncollectedParcels,
                'income' => $totalIncome,
            ],
            'chartData' => [
                'labels' => ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                'label' => $monthName . ' Sales',
                'data' => $weeklySales,
            ]
        ]);
    }
}