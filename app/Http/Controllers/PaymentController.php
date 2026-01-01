<?php

namespace App\Http\Controllers;
use App\Models\Parcel;
use App\Models\Courier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\ParcelPayment;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
class PaymentController extends Controller{
    public function generatePdf($id)
    {
        // 1. Fetch Payment Data
        $payment = Payment::where('PaymentID', $id)->firstOrFail();

        // 2. Fetch Parcel Items (Same logic as before)
        $paymentItems = DB::table('parcel_payments')
                            ->join('parcel', 'parcel_payments.TrackingNum', '=', 'parcel.TrackingNum')
                            ->where('parcel_payments.PaymentID', $id)
                            ->select('parcel.TrackingNum', 'parcel.CourierID', 'parcel.Weight', 'parcel.Price')
                            ->get();

        // 3. Load the view and pass data
        $pdf = Pdf::loadView('pdf.receipt', [
            'payment' => $payment,
            'items' => $paymentItems
        ]);

        // 4. Download the PDF (or use ->stream() to open in browser)
        return $pdf->stream('Receipt-'.$payment->PaymentID.'.pdf');
    }
    public function index()
    {
        $paymentList = Payment::latest()->get();
        return Inertia::render('Payment/ManagePayment', [
            'paymentList' => $paymentList,
        ]);
    }
    public function show($trackingNum)
    {
        $parcel = Parcel::where('TrackingNum', $trackingNum)->firstOrFail();

        return Inertia::render('Payment/Show', [
            'parcels' => [$parcel] 
        ]);
    }


    public function bulkShow(Request $request)
    {

        $ids = $request->input('ids', []);

        $parcels = Parcel::whereIn('TrackingNum', $ids)->get(); 

        if ($parcels->isEmpty()) {
            return redirect()->back()->with('error', 'No parcels selected');
        }

        return Inertia::render('Payment/Show', [
            'parcels' => $parcels
        ]);
    }
    public function processPayment(Request $request)
    {

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:parcel,TrackingNum',
            'method' => 'required|string',
            'total_amount' => 'required|numeric|min:0',
            'penalty_amount' => 'nullable|numeric|min:0',
        ]);

        $ids = $request->input('ids');
        $method = $request->input('method') === 'ewallet' ? 1 : 0;
        $totalAmount = $request->input('total_amount', 0);
        $penaltyAmount = $request->input('penalty_amount', 0);
        
        $latestPayment = \App\Models\Payment::latest('PaymentID')->first();

        if (!$latestPayment) {

            $newPaymentId = 'PAY-10000';
        } else {
        
            $lastIdNumber = (int) substr($latestPayment->PaymentID, 4);

            $newNumber = $lastIdNumber + 1;

            $newPaymentId = 'PAY-' . $newNumber;
        }


        $payment = new Payment();
        $payment->PaymentID = $newPaymentId;
        $payment->Price = $totalAmount;
        $payment->PaymentMethod = $method;
        $payment->PaymentDate = now();
        $payment->PaymentPenalty = $penaltyAmount;
        $payment->save();

        $parcelPayments = [];
        foreach ($ids as $trackingNum) {
            $parcelPayments[] = [   
                'PaymentID' => $payment->PaymentID,
                'TrackingNum' => $trackingNum,
                'created_at' => now(),
                'updated_at' => now(),
            ];  
        }

        ParcelPayment::insert($parcelPayments);

        Parcel::whereIn('TrackingNum', $ids)->update([
            'Status' => 'Collected',  
            'updated_at' => now(),
        ]);

        return to_route('parcels.manage')->with('message', 'Payment successful! Parcels marked as Collected.');
    }
}