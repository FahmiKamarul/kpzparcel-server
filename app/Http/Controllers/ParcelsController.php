<?php

namespace App\Http\Controllers;
use App\Models\Parcel;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ParcelsController extends Controller
{
    public function track(Request $request)
    {
        $request->validate([
            'TrackingNum' => 'required|string|max:255',
        ]);

        $trackingNum = $request->input('TrackingNum');

        $parcel = Parcel::with(['courier', 'staff'])->find($trackingNum);

        if (!$parcel) {
            return back()->withErrors([
                'TrackingNum' => 'Tracking number not found.',
            ]);
        }
        return Inertia::render('Parcel/Track', [
            'parcel' => $parcel
        ]);
    }
    
}
