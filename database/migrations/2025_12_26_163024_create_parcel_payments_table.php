<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parcel_payments', function (Blueprint $table) {
            $table->string('PaymentID');
            $table->string('TrackingNum');

            $table->primary(['PaymentID', 'TrackingNum']);

            $table->foreign('PaymentID')->references('PaymentID')->on('payment')->onDelete('cascade');
            $table->foreign('TrackingNum')->references('TrackingNum')->on('parcel')->onDelete('cascade');
            
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('parcel_payments');
    }
};