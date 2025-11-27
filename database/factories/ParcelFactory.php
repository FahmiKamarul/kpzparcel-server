<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ParcelFactory extends Factory
{
    public function definition(): array
    {
        return [
            // TrackingNum is the PK
            'TrackingNum' => strtoupper($this->faker->unique()->bothify('??####??')),
            'CustomerName' => $this->faker->name(),
            'ShelfNum' => $this->faker->numberBetween(1, 100),
            'Weight' => $this->faker->randomFloat(2, 0.5, 20), // 0.5kg to 20kg
            'DateArrive' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'Price' => $this->faker->randomFloat(2, 5, 50),
            'Status' => $this->faker->randomElement(['Ready', 'Collected']),
            
            // These will be overridden in the DatabaseSeeder to ensure valid FKs
            'CourierID' => '', 
            'StaffID' => '',
        ];
    }
}