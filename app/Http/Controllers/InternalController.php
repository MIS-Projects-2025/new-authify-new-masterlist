<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class InternalController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home');
    }

    public function profile(): Response
    {
        return Inertia::render('Profile');
    }
}