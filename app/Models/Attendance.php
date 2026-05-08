<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'student_id', 'class_id', 'attendance_date', 'status', 'remarks', 'marked_by'
    ];

    protected $casts = [
        'attendance_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo('App\Models\User', 'student_id');
    }

    public function class()
    {
        return $this->belongsTo('App\Models\MyClass', 'class_id');
    }

    public function markedBy()
    {
        return $this->belongsTo('App\Models\User', 'marked_by');
    }
}
