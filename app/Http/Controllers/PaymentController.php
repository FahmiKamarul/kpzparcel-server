<?php

namespace App\Http\Controllers;
use App\Models\Parcel;
use App\Models\Courier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\ParcelPayment;
class PaymentController extends Controller{
    public function pay($trackingNum)
    {
        $parcel = Parcel::find($trackingNum);

        if (!$parcel) {
            return back()->withErrors([
                'TrackingNum' => 'Tracking number not found.',
            ]);
        }
        if ($parcel->status != 'Ready') {
            return back()->withErrors([
                'Payment' => 'Payment has already been made for this parcel.',
            ]);
        }

        // Here you would typically integrate with a payment gateway.
        // For demonstration, we'll just create a Payment record.

        $payment = new Payment();
        $payment->PaymentID = uniqid('pay_'); // Generate a unique PaymentID

        // Link the payment to the parcel in parcel_payments table
        $parcel->payments()->attach($payment->PaymentID);

        return Inertia::render('Payment/Pay', [
            'parcel' => $parcel,
            'payment' => $payment,
        ]);
    }
    public function show($trackingNum)
    {
        $parcel = Parcel::where('TrackingNum', $trackingNum)->firstOrFail();

        return Inertia::render('Payment/Show', [
            'parcels' => [$parcel] // Wrap in array
        ]);
    }

    // NEW: For bulk items
    public function bulkShow(Request $request)
    {
        // Get the list of IDs from the URL ?ids[]=123&ids[]=456
        $ids = $request->input('ids', []);

        // Find all parcels matching those IDs (or TrackingNums)
        // Assuming your ID column is 'id'. If it's 'TrackingNum', change whereIn('TrackingNum', $ids)
        $parcels = Parcel::whereIn('TrackingNum', $ids)->get(); // OR whereIn('TrackingNum', $ids)

        if ($parcels->isEmpty()) {
            return redirect()->back()->with('error', 'No parcels selected');
        }

        return Inertia::render('Payment/Show', [
            'parcels' => $parcels
        ]);
    }
}