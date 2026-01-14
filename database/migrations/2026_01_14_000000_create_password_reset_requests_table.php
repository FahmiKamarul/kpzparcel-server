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
        Schema::create('password_reset_requests', function (Blueprint $table) {
            $table->id();
            $table->string('StaffID');
            $table->string('new_password'); // hashed password
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('requested_at')->useCurrent();
            $table->timestamp('reviewed_at')->nullable();
            $table->string('approved_by')->nullable(); // StaffID of manager who approved
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            $table->foreign('StaffID')
                  ->references('StaffID')
                  ->on('users')
                  ->onDelete('cascade');

            $table->foreign('approved_by')
                  ->references('StaffID')
                  ->on('users')
                  ->onDelete('set null');

            $table->index('status');
            $table->index('requested_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_reset_requests');
    }
};
