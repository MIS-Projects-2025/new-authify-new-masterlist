<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $table = 'cards';

    protected $primaryKey = 'id';

    const CREATED_AT = 'date_created';
    const UPDATED_AT = 'date_updated';

    public $timestamps = true;

    protected $fillable = [
        'department_id',
        'card_icon',
        'card_title',
        'description',
        'sort_order',
        'is_active',
        'date_created',
        'date_updated',
    ];

    protected $casts = [
        'id' => 'integer',
        'department_id' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'date_created' => 'datetime',
        'date_updated' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function systems()
    {
        return $this->hasMany(System::class, 'card_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}