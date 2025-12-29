<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payment';
    protected $primaryKey = 'PaymentID';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'PaymentID', 'Price', 
        'PaymentMethod', 'PaymentDate', 'PaymentPenalty'
    ];

    // Relationship: Payment belongs to a Parcel
}