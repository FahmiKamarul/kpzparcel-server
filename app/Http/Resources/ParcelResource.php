<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParcelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'tracking_number' => $this->TrackingNum,
            'customer_name' => $this->CustomerName,
            'shelf_number' => $this->ShelfNum,
            'weight' => $this->Weight . ' kg',
            'price' => $this->Price,
            'status' => $this->Status,
            'date_arrived' => $this->DateArrive,
            // Automatically include related data
            'courier' => [
                'id' => $this->courier->CourierID ?? null,
                'name' => $this->courier->CourierName ?? 'Unknown',
            ],
            'handled_by' => $this->staff->Name ?? 'Unknown',
        ];
    }
}