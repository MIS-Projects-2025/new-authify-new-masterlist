<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(
            Department::orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:100',
            'basename'   => 'required|string|max:50|unique:departments,basename',
            'color_key'  => 'required|string|max:50',
            'icon'       => 'required|string|max:100',
            'sort_order' => 'integer',
            'is_active'  => 'boolean',
        ]);

        return response()->json(Department::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $dept = Department::findOrFail($id);

        $data = $request->validate([
            'name'       => 'string|max:100',
            'basename'   => 'string|max:50|unique:departments,basename,' . $id,
            'color_key'  => 'string|max:50',
            'icon'       => 'string|max:100',
            'sort_order' => 'integer',
            'is_active'  => 'boolean',
        ]);

        $dept->update($data);
        return response()->json($dept);
    }

    public function destroy($id)
    {
        $dept = Department::findOrFail($id);
        $dept->delete();
        return response()->json(['message' => 'Deleted']);
    }
}