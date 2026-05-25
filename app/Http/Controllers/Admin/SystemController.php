<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\System;
use Illuminate\Http\Request;

class SystemController extends Controller
{
    public function index()
    {
        return response()->json(
            System::with('card.department')->orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'card_id'           => 'required|exists:cards,id',
            'list_name'         => 'required|string|max:150',
            'system_url'        => 'required|string|max:500',
            'modal_icon'        => 'required|string|max:100',
            'system_status'     => 'integer|in:0,1,2',
            'require_auto_login'=> 'boolean',
            'sort_order'        => 'integer',
        ]);

        return response()->json(System::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $system = System::findOrFail($id);

        $data = $request->validate([
            'card_id'           => 'exists:cards,id',
            'list_name'         => 'string|max:150',
            'system_url'        => 'string|max:500',
            'modal_icon'        => 'string|max:100',
            'system_status'     => 'integer|in:0,1,2',
            'require_auto_login'=> 'boolean',
            'sort_order'        => 'integer',
        ]);

        $system->update($data);
        return response()->json($system);
    }

    public function destroy($id)
    {
        System::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}