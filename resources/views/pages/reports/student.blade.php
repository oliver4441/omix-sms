@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Student Performance Report</h2>
    
    <form method="GET" action="{{ route('reports.student') }}">
        <div class="form-group">
            <label>Student</label>
            <select name="student_id" class="form-control" required>
                <option value="">Select Student</option>
                @foreach($students as $student)
                    <option value="{{ $student->id }}" {{ request('student_id') == $student->id ? 'selected' : '' }}>{{ $student->name }}</option>
                @endforeach
            </select>
        </div>
        
        <div class="form-group">
            <label>Report Type</label>
            <select name="type" class="form-control">
                <option value="marksheet">Marksheet</option>
                <option value="attendance">Attendance</option>
                <option value="combined">Combined Report</option>
            </select>
        </div>
        
        <button type="submit" class="btn btn-primary">View Report</button>
        <button type="button" class="btn btn-secondary" onclick="window.open('{{ route('reports.pdf', ['student_id' => request('student_id'), 'type' => request('type', 'marksheet')]) }}', '_blank')">Download PDF</button>
    </form>
    
    @if(isset($student))
        <div class="mt-4">
            <h4>{{ $student->name }} - Report</h4>
            <!-- Marksheet Section -->
            @if($type == 'marksheet' || $type == 'combined')
                <h5>Marksheet</h5>
                <!-- Add marksheet display here -->
            @endif
            
            <!-- Attendance Section -->
            @if($type == 'attendance' || $type == 'combined')
                <h5>Attendance</h5>
                <!-- Add attendance display here -->
            @endif
        </div>
    @endif
</div>
@endsection
