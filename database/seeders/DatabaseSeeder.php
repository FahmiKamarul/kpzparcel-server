<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Courier;
use App\Models\Parcel;
use App\Models\Payment;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a known Admin/Manager User (So you can log in)
        $manager = User::factory()->create([
            'StaffID' => 'ADMIN001',
            'Name' => 'System Admin',
            'Role' => 'Manager', // This triggers the 'managers' table insert automatically
            'Password' => bcrypt('password123'),
        ]);

        // 2. Create 10 Random Staff/Managers
        $users = User::factory()->count(10)->create();

        // 3. Create Specific Couriers (Realistic Malaysian context)
        $couriers = collect([
            ['CourierID' => 'JNT', 'CourierName' => 'J&T Express'],
            ['CourierID' => 'POS', 'CourierName' => 'Pos Laju'],
            ['CourierID' => 'SPX', 'CourierName' => 'Shopee Xpress'],
            ['CourierID' => 'DHL', 'CourierName' => 'DHL'],
        ]);
        
        foreach ($couriers as $courierData) {
            Courier::factory()->create($courierData);
        }
        
        // Refresh courier list from DB
        $courierIds = Courier::pluck('CourierID');
        $userIds = User::pluck('StaffID');

        // 4. Create Parcels
        // We create 50 parcels, assigning random Users and Couriers to them
        $parcels = Parcel::factory()->count(50)->make()->each(function ($parcel) use ($userIds, $courierIds) {
            $parcel->StaffID = $userIds->random();
            $parcel->CourierID = $courierIds->random();
            $parcel->save();
        });

        // 5. Create Payments
        // Only create payments for parcels that have been 'Collected'
        $collectedParcels = Parcel::where('Status', 'Collected')->get();

        foreach ($collectedParcels as $parcel) {
            Payment::factory()->create([
                'TrackingNum' => $parcel->TrackingNum,
                'Price' => $parcel->Price, // Payment usually matches parcel price
            ]);
        }
    }
}