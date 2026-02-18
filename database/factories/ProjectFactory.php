<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 month', '+1 month');
        $estimatedEndDate = fake()->dateTimeBetween($startDate, '+6 months');

        return [
            'customer_id' => Customer::factory(),
            'manager_id' => null,
            'name' => fake()->randomElement([
                'Kitchen Renovation',
                'Bathroom Remodel',
                'Home Extension',
                'Roof Replacement',
                'Basement Finishing',
                'Deck Construction',
                'Garage Addition',
                'Window Replacement',
                'Flooring Installation',
                'HVAC Installation',
            ]).' - '.fake()->streetName(),
            'description' => fake()->optional(0.7)->paragraph(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->stateAbbr(),
            'zip' => fake()->postcode(),
            'start_date' => $startDate,
            'estimated_end_date' => $estimatedEndDate,
            'actual_end_date' => null,
            'total_budget' => fake()->randomFloat(2, 10000, 500000),
            'status' => Project::STATUS_DRAFT,
            'progress_percentage' => 0,
        ];
    }

    public function withManager(?User $manager = null): static
    {
        return $this->state(fn (array $attributes) => [
            'manager_id' => $manager?->id ?? User::factory(),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Project::STATUS_DRAFT,
            'progress_percentage' => 0,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Project::STATUS_ACTIVE,
            'progress_percentage' => fake()->numberBetween(1, 99),
        ]);
    }

    public function onHold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Project::STATUS_ON_HOLD,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Project::STATUS_COMPLETED,
            'progress_percentage' => 100,
            'actual_end_date' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Project::STATUS_CANCELLED,
        ]);
    }
}
