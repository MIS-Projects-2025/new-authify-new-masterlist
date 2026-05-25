<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\VerifyCsrfToken;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // ✅ Sanctum (unchanged)
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // ✅ Exclude SSO cookies from encryption so other apps can read them
        $middleware->encryptCookies(except: [
            'sso_token',
            'authify_token', // Authify's own internal session cookie
        ]);

        // ✅ Named middleware aliases
        $middleware->alias([
            'verified'      => \App\Http\Middleware\EnsureEmailIsVerified::class, // unchanged
            'auth.internal' => \App\Http\Middleware\AuthifyInternalMiddleware::class, // NEW
        ]);

        // ✅ Global web middleware (no AuthMiddleware here — moved to route groups)
        $middleware->web(append: [
            VerifyCsrfToken::class,                                                    // unchanged
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
          
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();