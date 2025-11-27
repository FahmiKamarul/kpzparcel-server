<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Parcel;
use App\Http\Resources\ParcelResource;
use Illuminate\Http\Request;

class ParcelController extends Controller
{

    public function index()
    {
        $parcels = Parcel::with('courier')->paginate(10);
        return ParcelResource::collection($parcels);
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

        $parcel = Parcel::create($validated);

        return new ParcelResource($parcel);
    }


    public function show($id)
    {

        $parcel = Parcel::with(['courier', 'staff'])->findOrFail($id);
        return new ParcelResource($parcel);
    }

    public function update(Request $request, $id)
    {
        $parcel = Parcel::findOrFail($id);

        $parcel->update($request->all());

        return new ParcelResource($parcel);
    }


    public function destroy($id)
    {
        $parcel = Parcel::findOrFail($id);
        $parcel->delete();

        return response()->json(['message' => 'Parcel deleted successfully']);
    }
}