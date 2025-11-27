<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CourierFactory extends Factory
{
    public function definition(): array
    {
        return [
            // Generates CourierID like 'COU-01'
            'CourierID' => 'COU-' . $this->faker->unique()->numerify('##'),
            'CourierName' => $this->faker->unique()->company(), 
        ];
    }
}