<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'StaffID';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'StaffID', 'Name', 'PhoneNum', 'Address', 
        'Role', 'Password', 'ActiveStatus',
    ];

    protected $hidden = [
        'Password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }

    public function getAuthPassword()
    {
        return $this->Password;
    }
}