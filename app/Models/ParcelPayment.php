<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParcelPayment extends Model
{
    use HasFactory;

    protected $table = 'parcel_payments';

    protected $fillable = ['PaymentID', 'TrackingNum'];
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'PaymentID', 'PaymentID');
    }
    public function parcel()
    {
        return $this->belongsTo(Parcel::class, 'TrackingNum', 'TrackingNum');
    }
}