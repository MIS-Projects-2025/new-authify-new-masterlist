<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Card;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index()
    {
        return response()->json(
            Card::with('department')->orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'card_icon'     => 'required|string|max:100',
            'card_title'    => 'required|string|max:150',
            'description'   => 'nullable|string',
            'sort_order'    => 'integer',
            'is_active'     => 'boolean',
        ]);

        return response()->json(Card::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        $data = $request->validate([
            'department_id' => 'exists:departments,id',
            'card_icon'     => 'string|max:100',
            'card_title'    => 'string|max:150',
            'description'   => 'nullable|string',
            'sort_order'    => 'integer',
            'is_active'     => 'boolean',
        ]);

        $card->update($data);
        return response()->json($card);
    }

    public function destroy($id)
    {
        Card::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}