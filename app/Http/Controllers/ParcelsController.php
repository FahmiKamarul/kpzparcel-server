<?php

namespace App\Http\Controllers;
use App\Models\Parcel;
use App\Models\Courier;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ParcelsController extends Controller
{
    public function index()
    {
        $parcels = Parcel::latest()->get(); 
        return Inertia::render('Parcel/ManageParcel', [
        'parcels' => $parcels,
        ]);
    }
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
    public function store(Request $request)
    {

        $validated = $request->validate([
            'TrackingNum' => 'required|unique:parcel,TrackingNum|max:255',
            'CourierID' => 'required|exists:courier,CourierID',
            'StaffID' => 'required|exists:users,StaffID',
            'CustomerName' => 'required|string',
            'ShelfNum' => 'required|integer',
            'Weight' => 'required|numeric',
            'Price' => 'required|numeric',
            'DateArrive' => 'required|date',
        ]);
        $validatedData['Status'] = 'Ready';
        $parcel = Parcel::create($validated);

        return redirect()->route('parcels.manage')->with('success', 'Parcel inserted successfully!');
    }
    public function edit(Parcel $parcel)
    {
        $courierOptions = Courier::all(['CourierID', 'CourierName']);
        
        return Inertia::render('Parcel/Update', [
            'parcel' => $parcel,
            'courierOptions' => $courierOptions,
        ]);
    }
    public function show($id)
    {

        $parcel = Parcel::with(['courier', 'staff'])->findOrFail($id);
        return new ParcelResource($parcel);
    }
    public function update(Request $request, Parcel $parcel)
    {
        $validated = $request->validate([
            'CourierID' => 'required|exists:courier,CourierID',
            'StaffID' => 'required|exists:users,StaffID',
            'CustomerName' => 'required|string',
            'ShelfNum' => 'required|integer',
            'Weight' => 'required|numeric',
            'Price' => 'required|numeric',
            'DateArrive' => 'required|date',
        ]);

        $parcel->update($validated);

        return redirect()->route('parcels.manage')->with('success', 'Parcel updated successfully!');
    }

    public function create()
    {
        $courierOptions = Courier::all(['CourierID', 'CourierName']);
        return Inertia::render('Parcel/Create', [
            'courierOptions' => $courierOptions,
        ]);
    }
    public function destroy(Parcel $parcel)
    {
        $parcel->delete();

        return redirect()->route('parcels.manage')->with('success', 'Parcel deleted successfully!');
    }
    
}
