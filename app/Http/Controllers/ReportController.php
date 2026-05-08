<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use App\Repositories\UserRepo;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected $user;
    
    public function __construct(UserRepo $user)
    {
        $this->user = $user;
    }
    
    // Student performance report
    public function studentReport(Request $request)
    {
        $data['students'] = $this->user->getStudents();
        return view('pages.reports.student', $data);
    }
    
    // Class attendance report
    public function attendanceReport(Request $request)
    {
        $data['classes'] = $this->user->getClasses();
        return view('pages.reports.attendance', $data);
    }
    
    // Generate PDF report
    public function generatePDF(Request $request)
    {
        $request->validate([
            'student_id' => 'required',
            'type' => 'required|in:marksheet,attendance,combined'
        ]);
        
        $student = User::findOrFail($request->student_id);
        
        if($request->type == 'marksheet') {
            $pdf = PDF::loadView('pages.reports.pdf.marksheet', compact('student'));
        } elseif($request->type == 'attendance') {
            $attendances = Attendance::where('student_id', $request->student_id)->get();
            $pdf = PDF::loadView('pages.reports.pdf.attendance', compact('student', 'attendances'));
        } else {
            $pdf = PDF::loadView('pages.reports.pdf.combined', compact('student'));
        }
        
        return $pdf->download('report_'.$student->name.'_'.date('Y-m-d').'.pdf');
    }
}
