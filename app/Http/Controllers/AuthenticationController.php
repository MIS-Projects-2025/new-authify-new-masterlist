<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthenticationController extends Controller
{
    public function logout(Request $request)
    {
        $cookieName = env('SSO_COOKIE_NAME', 'sso_token');

        // Get token from this system's own cookie or session
        $token = $request->cookie($cookieName)
            ?? session('emp_data.token');

        // Clear local Laravel session
        session()->forget('emp_data');
        session()->flush();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Clear this system's own cookie only — does NOT affect other systems
        $expiredCookie = cookie()->forget($cookieName);

        // Redirect to Authify to delete the DB token, then come back to login
        $redirectUrl = urlencode(route('dashboard'));

        return redirect(
            "http://192.168.2.221:8080/logout?token={$token}"
        )->withCookie($expiredCookie);
    }
}