<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            // Generates a random StaffID like 'STF-12345'
            'StaffID' => 'STF-' . $this->faker->unique()->numerify('#####'), 
            'Name' => $this->faker->name(),
            'PhoneNum' => $this->faker->phoneNumber(),
            'Address' => $this->faker->address(),
            'Role' => $this->faker->randomElement(['Staff', 'Manager']),
            'Password' => Hash::make('password'), // Default password
            'ActiveStatus' => 1,
        ];
    }
}