<?php

namespace App\Http\Controllers;

use App\Models\AuthifySession;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function login(Request $request)
    {
        $this->purgeOverstayingTokens();

        $credentials = $request->validate([
            'employeeID' => ['required'],
            'password'   => ['required'],
        ]);

        $redirectUrl = $request->input('redirect') ?? $request->query('redirect');

        $result = $this->authService->login($credentials, $redirectUrl);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 401);
        }

        $emp_data = $result['data'];

        // 💾 Save session via model
        AuthifySession::create($emp_data);

        // 🍪 Internal login
        if (!$redirectUrl) {
            $cookie = cookie('authify_token', $emp_data['token'], 60 * 24 * 7);

            return response()->json([
                'success'      => true,
                'redirect_url' => route('authify.home'),
            ])->withCookie($cookie);
        }

        // 🌐 External redirect
        $separator  = str_contains($redirectUrl, '?') ? '&' : '?';
        $redirectTo = $redirectUrl . $separator . 'key=' . $emp_data['token'];

        return response()->json([
            'success'      => true,
            'redirect_url' => $redirectTo,
        ]);
    }

    public function loginForm(Request $request)
    {
        return Inertia::render('Login', [
            'redirectUrl' => $request->query('redirect'),
        ]);
    }

    public function validate(Request $request)
    {
        $token = $request->query('token');

        $record = AuthifySession::where('token', $token)->first();

        if (!$record) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid Token',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $record,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->query('token');

        AuthifySession::where('token', $token)->delete();

        session()->flush();

        $redirectUrl = $request->query('redirect');

        if ($redirectUrl) {
            return redirect($redirectUrl);
        }

        return redirect()->route('sso.login');
    }

    protected function purgeOverstayingTokens(): void
    {
        AuthifySession::where('generated_at', '<', now()->subHours(12))->delete();
    }
}
