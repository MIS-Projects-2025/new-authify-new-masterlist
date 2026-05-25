<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeAuth extends Model
{
    protected $table = 'employee_auth';
    protected $connection = 'masterlist';
    public $timestamps = false;

    protected $fillable = [
        'employid',
        'username',
        'password',
        'created_at',
    ];

    public function detail()
    {
        return $this->belongsTo(EmployeeDetail::class, 'employid', 'employid');
    }
}
