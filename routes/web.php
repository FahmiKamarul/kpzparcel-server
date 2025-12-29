<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\ParcelsController;
use App\Http\Controllers\PaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\Parcel;
use App\Models\User;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::post('/parcel/track', [App\Http\Controllers\ParcelsController::class, 'track'])->name('parcel.track');


Route::middleware(['auth','manager'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');
    Route::get('/staff', [App\Http\Controllers\StaffController::class, 'index'])->name('staff.manage');
    Route::delete('/staff/{user}', [StaffController::class, 'destroy'])
        ->name('staff.destroy');
    Route::get('/staff/{user}/update', [StaffController::class, 'update'])->name('staff.update');
    Route::patch('/staff/{user}/edit', [StaffController::class, 'edit'])->name('staff.edit');
});
Route::middleware('auth')->group(function () {
    Route ::get('/parcels', [App\Http\Controllers\ParcelsController::class, 'index'])->name('parcels.manage');

    Route::get('/parcels/create', [ParcelsController::class, 'create'])->name('parcel.create');
    Route::post('/parcels', [ParcelsController::class, 'store'])->name('parcel.store');
    Route::get('/parcels/{parcel}/edit', [ParcelsController::class, 'edit'])->name('parcel.edit');
    Route::patch('/parcels/{parcel}', [ParcelsController::class, 'update'])->name('parcel.update');
    Route::delete('/parcels/{parcel}', [ParcelsController::class, 'destroy'])->name('parcel.destroy');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/parcel/pay/{trackingNum}', [PaymentController::class, 'pay'])->name('pay.single');
    Route::get('/payment/bulk', [PaymentController::class, 'bulkShow'])->name('payment.bulk');
    Route::get('/payment/{trackingNum}', [PaymentController::class, 'show'])->name('payment.show');
    Route::post('/payment/process', [PaymentController::class, 'processPayment'])->name('payment.process');
});

require __DIR__.'/auth.php';
