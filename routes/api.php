<?php

use App\Http\Controllers\Api\ParcelController;
use Illuminate\Support\Facades\Route;

Route::apiResource('parcels', ParcelController::class);