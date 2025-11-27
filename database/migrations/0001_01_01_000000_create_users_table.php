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

        Schema::create('users', function (Blueprint $table) {
            $table->string('StaffID')->primary();
            $table->string('Name');
            $table->string('PhoneNum');
            $table->string('Address');
            $table->enum('Role', ['Staff', 'Manager'])->default('Staff');
            $table->string('Password');
            $table->boolean('ActiveStatus')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });
        Schema::create('managers', function (Blueprint $table) {
            $table->string('StaffID')->primary(); 
            $table->date('AccessExpiryDate');
            $table->foreign('StaffID')
                  ->references('StaffID')
                  ->on('users')
                  ->onDelete('cascade');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('StaffID')->primary(); 
            
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // === 3. 'sessions' table (unchanged) ===
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index(); 
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};