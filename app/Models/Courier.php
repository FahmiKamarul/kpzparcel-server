<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Courier extends Model
{
    use HasFactory;

    // 1. Point to the correct table name (singular)
    protected $table = 'courier';

    // 2. Define the Primary Key
    protected $primaryKey = 'CourierID';

    // 3. Disable Auto-Increment (since it's a String ID like 'COU-01')
    public $incrementing = false;

    // 4. Set Key Type to String
    protected $keyType = 'string';

    protected $fillable = ['CourierID', 'CourierName'];
}