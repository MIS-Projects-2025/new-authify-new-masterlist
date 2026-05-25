<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departments';

    protected $primaryKey = 'id';

    // Use custom timestamp columns
    const CREATED_AT = 'date_created';
    const UPDATED_AT = 'date_updated';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'basename',
        'color',
        'icon',
        'sort_order',
        'is_active',
        'date_created',
        'date_updated',
    ];

    protected $casts = [
        'id' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'date_created' => 'datetime',
        'date_updated' => 'datetime',
    ];
}