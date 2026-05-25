<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InternalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__ . '/general.php';

require __DIR__ . '/auth.php'; 
// ─────────────────────────────────────────
// 🔓 Public routes — no middleware
// ─────────────────────────────────────────
Route::get('/login', [AuthController::class, 'loginForm'])->name('sso.login');
Route::post('/login', [AuthController::class, 'login'])->name('sso.login.post');
Route::get('/logout', [AuthController::class, 'logout'])->name('sso.logout');
Route::get('/validate', [AuthController::class, 'validate'])->name('sso.validate');
Route::get('/admin/portal', fn() => inertia('Admin/AdminPortal'))->name('admin.portal');
// ─────────────────────────────────────────
// 🔒 Internal Authify pages — protected
// ─────────────────────────────────────────
Route::middleware('auth.internal')->group(function () {
    Route::get('/home', [InternalController::class, 'home'])->name('authify.home');

});