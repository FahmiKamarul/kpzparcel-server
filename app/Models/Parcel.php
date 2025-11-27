<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parcel extends Model
{
    use HasFactory;

    protected $table = 'parcel';
    protected $primaryKey = 'TrackingNum';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'TrackingNum', 'CourierID', 'StaffID', 'CustomerName',
        'ShelfNum', 'Weight', 'DateArrive', 'Price', 'Status'
    ];

    // Relationship: A parcel belongs to a Courier
    public function courier()
    {
        return $this->belongsTo(Courier::class, 'CourierID', 'CourierID');
    }

    // Relationship: A parcel was handled by a User (Staff)
    public function staff()
    {
        return $this->belongsTo(User::class, 'StaffID', 'StaffID');
    }
}