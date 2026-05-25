<?php

use App\Http\Controllers\PortalController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\CardController;
use App\Http\Controllers\Admin\SystemController;


Route::middleware('auth.internal')->group(function () {

    // ── Admin routes first (more specific) ──
    Route::prefix('admin')->group(function () {
        Route::get('/departments', [DepartmentController::class, 'index']);
        Route::post('/departments', [DepartmentController::class, 'store']);
        Route::put('/departments/{id}', [DepartmentController::class, 'update']);
        Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);

        Route::get('/cards', [CardController::class, 'index']);
        Route::post('/cards', [CardController::class, 'store']);
        Route::put('/cards/{id}', [CardController::class, 'update']);
        Route::delete('/cards/{id}', [CardController::class, 'destroy']);

        Route::get('/systems', [SystemController::class, 'index']);
        Route::post('/systems', [SystemController::class, 'store']);
        Route::put('/systems/{id}', [SystemController::class, 'update']);
        Route::delete('/systems/{id}', [SystemController::class, 'destroy']);
    });

    // ── Portal routes after (generic, has {basename} wildcard) ──
    Route::get('/departments', [PortalController::class, 'departments']);
    Route::get('/cards/{basename}', [PortalController::class, 'cards']);
    Route::get('/systems/{cardId}', [PortalController::class, 'systems']);
});
