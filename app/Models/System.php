<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class System extends Model
{
    protected $table = 'systems';

    protected $primaryKey = 'id';

    const CREATED_AT = 'date_created';
    const UPDATED_AT = 'date_updated';

    public $timestamps = true;

    protected $fillable = [
        'card_id',
        'list_name',
        'system_url',
        'modal_icon',
        'system_status',
        'require_auto_login',
        'sort_order',
        'date_created',
        'date_updated',
    ];

    protected $casts = [
        'id' => 'integer',
        'card_id' => 'integer',
        'system_status' => 'boolean',
        'require_auto_login' => 'boolean',
        'sort_order' => 'integer',
        'date_created' => 'datetime',
        'date_updated' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function card()
    {
        return $this->belongsTo(Card::class, 'card_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActive($query)
    {
        return $query->where('system_status', 1);
    }
}