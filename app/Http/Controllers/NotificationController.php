<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Send attendance alert to parent
    public function attendanceAlert($student_id, $date)
    {
        $student = User::findOrFail($student_id);
        $parent = $student->parent; // Assuming relationship exists
        
        if($parent && $parent->email) {
            Mail::send('emails.attendance_alert', [
                'student' => $student,
                'date' => $date
            ], function($message) use ($parent) {
                $message->to($parent->email)
                        ->subject('Attendance Alert - ' . config('app.name'));
            });
            return response()->json(['success' => true, 'message' => 'Alert sent']);
        }
        return response()->json(['success' => false, 'message' => 'No parent email']);
    }
    
    // Send fee reminder
    public function feeReminder($student_id)
    {
        $student = User::findOrFail($student_id);
        $parent = $student->parent;
        
        if($parent && $parent->email) {
            Mail::send('emails.fee_reminder', [
                'student' => $student
            ], function($message) use ($parent) {
                $message->to($parent->email)
                        ->subject('Fee Payment Reminder - ' . config('app.name'));
            });
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false]);
    }
}
