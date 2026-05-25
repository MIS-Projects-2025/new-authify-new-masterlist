<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Card;
use App\Models\System;
use Illuminate\Http\Request;
use Inertia\Inertia; // Add this import

class PortalController extends Controller
{
    /**
     * Main portal page - renders the SystemCards component
     */
    public function index(Request $request)
    {
        // Get all departments for the sidebar
        $departments = Department::where('is_active', 1)
            ->orderBy('sort_order')
            ->get();
        
        // Return the SystemCards component with departments data
        return Inertia::render('SystemCards', [
            'departments' => $departments,
        ]);
    }
    
    /**
     * API: Get all departments
     */
    public function departments()
    {
        return response()->json(
            Department::where('is_active', 1)
                ->orderBy('sort_order')
                ->get()
        );
    }

    /**
     * API: Get cards for a specific department
     */
    public function cards($basename)
    {
        $dept = Department::where('basename', $basename)->firstOrFail();

        return response()->json(
            Card::where('department_id', $dept->id)
                ->where('is_active', 1)
                ->orderBy('sort_order')
                ->get()
        );
    }

    /**
     * API: Get systems for a specific card
     */
    public function systems($cardId)
    {
        return response()->json(
            System::where('card_id', $cardId)
                ->orderBy('sort_order')
                ->get()
        );
    }
}