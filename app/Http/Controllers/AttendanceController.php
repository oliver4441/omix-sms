<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Repositories\UserRepo;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    protected $user;
    
    public function __construct(UserRepo $user)
    {
        $this->user = $user;
    }
    
    // Mark attendance for a class
    public function mark(Request $request)
    {
        $data['classes'] = $this->user->getClasses();
        return view('pages.attendance.mark', $data);
    }
    
    // Save attendance
    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required',
            'date' => 'required|date',
            'attendance' => 'required|array'
        ]);
        
        foreach($request->attendance as $student_id => $status) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $student_id,
                    'attendance_date' => $request->date,
                ],
                [
                    'class_id' => $request->class_id,
                    'status' => $status,
                    'marked_by' => auth()->id(),
                    'remarks' => $request->remarks[$student_id] ?? null
                ]
            );
        }
        
        return redirect()->back()->with('success', 'Attendance marked successfully!');
    }
    
    // View attendance report
    public function report(Request $request)
    {
        $data['classes'] = $this->user->getClasses();
        return view('pages.attendance.report', $data);
    }
}
