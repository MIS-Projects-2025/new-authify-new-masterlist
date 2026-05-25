<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthifyInternalMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // 🔹 Check cookie first, then session fallback
        $token = $request->cookie('authify_token')
            ?? $request->cookie('sso_token') // ✅ fallback support
            ?? session('emp_data.token');

        // 🔹 No token → redirect to Authify login
        if (!$token) {
            return redirect()->route('sso.login');
        }

        // 🔹 Session already valid & matches → let through
        if (session()->has('emp_data') && session('emp_data.token') === $token) {

            return $next($request)
                ->withCookie(cookie('authify_token', $token, 60 * 24 * 7, '/', null, false, true))
                ->withCookie(cookie('sso_token', $token, 60 * 24 * 7, '/', null, false, true)); // ✅ add this
        }

        // 🔹 Validate token
        $currentUser = DB::connection('authify')
            ->table('authify_sessions')
            ->where('token', $token)
            ->first();

        // 🔹 Invalid token → clear cookies
        if (!$currentUser) {
            session()->forget('emp_data');

            return redirect()->route('sso.login')
                ->withCookie(cookie('authify_token', '', -1, '/'))
                ->withCookie(cookie('sso_token', '', -1, '/')); // ✅ clear both
        }
        $job = strtolower(trim($currentUser->emp_jobtitle ?? ''));

        $role = (
            str_contains($job, 'programmer') ||
            str_contains($job, 'mis senior supervisor')
        ) ? 'admin' : 'user';
        // 🔹 Rebuild session
      session(['emp_data' => [
            'token'          => $currentUser->token,
            'emp_id'         => $currentUser->emp_id,
            'emp_name'       => $currentUser->emp_name,
            'emp_firstname'  => $currentUser->emp_firstname,


            'emp_dept_id'      => $currentUser->emp_dept_id,
            'emp_jobtitle_id'  => $currentUser->emp_jobtitle_id,
            'emp_prodline_id'  => $currentUser->emp_prodline_id,
            'emp_position_id'  => $currentUser->emp_position_id,
            'emp_station_id'   => $currentUser->emp_station_id,

            'generated_at'   => $currentUser->generated_at,
        ]]);


        session()->save();

        Log::info('AuthifyInternalMiddleware: session rebuilt', [
            'emp_id' => $currentUser->emp_id,
        ]);

        // 🔹 Set BOTH cookies
        return $next($request)
            ->withCookie(cookie('authify_token', $token, 60 * 24 * 7, '/', null, false, true))
            ->withCookie(cookie('sso_token', $token, 60 * 24 * 7, '/', null, false, true)); // ✅ important
    }
}
