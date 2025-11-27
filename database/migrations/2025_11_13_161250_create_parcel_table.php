<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parcel', function (Blueprint $table) {
            $table->string('TrackingNum')->primary();
            $table->string('CourierID');
            $table->foreign('CourierID')
                  ->references('CourierID')
                  ->on('courier')
                  ->onDelete('cascade');
            $table->string('StaffID');
            $table->foreign('StaffID')
                  ->references('StaffID')
                  ->on('users')
                  ->onDelete('cascade');
            $table->string('CustomerName');
            $table->integer('ShelfNum');
            $table->double('Weight');
            $table->date('DateArrive');
            $table->double('Price');
            $table->enum('Status', ['Ready', 'Collected'])->default('Ready');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parcel');
    }
};
