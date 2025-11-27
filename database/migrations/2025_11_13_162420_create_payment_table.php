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
        Schema::create('payment', function (Blueprint $table) {
            $table->string('PaymentID')->primary();
            $table->string('TrackingNum');
            $table->foreign('TrackingNum')
                  ->references('TrackingNum')
                  ->on('parcel')
                  ->onDelete('cascade');
            $table->double('Price');
            $table->boolean('PaymentMethod');
            $table->date('PaymentDate');
            $table->double('PaymentPenalty');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment');
    }
};
