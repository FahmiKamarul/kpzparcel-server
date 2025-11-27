<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'PaymentID' => 'PAY-' . $this->faker->unique()->numerify('#####'),
            'Price' => $this->faker->randomFloat(2, 5, 50),
            'PaymentMethod' => $this->faker->boolean(), // 0 or 1
            'PaymentDate' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'PaymentPenalty' => 0.00,
            
            // This will be overridden in the Seeder
            'TrackingNum' => '',
        ];
    }
}