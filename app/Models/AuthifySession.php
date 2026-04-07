<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthifySession extends Model
{
    protected $table      = 'authify_sessions';
    protected $connection = 'authify';
    protected $primaryKey = 'token';
    public    $incrementing = false;
    protected $keyType    = 'string';
    public    $timestamps = false;

    protected $fillable = [
        'token',
        'emp_id',
        'emp_name',
        'emp_firstname',
        'emp_dept_id',
        'emp_jobtitle_id',
        'emp_prodline_id',
        'emp_position_id',
        'emp_station_id',
        'generated_at',
    ];
}
