@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Attendance Report</h2>
    
    <form method="GET" action="{{ route('attendance.report') }}">
        <div class="form-group">
            <label>Class</label>
            <select name="class_id" class="form-control">
                <option value="">All Classes</option>
                @foreach($classes as $class)
                    <option value="{{ $class->id }}" {{ request('class_id') == $class->id ? 'selected' : '' }}>{{ $class->name }}</option>
                @endforeach
            </select>
        </div>
        
        <div class="form-group">
            <label>Month</label>
            <input type="month" name="month" class="form-control" value="{{ request('month', date('Y-m') }}">
        </div>
        
        <button type="submit" class="btn btn-primary">Generate Report</button>
    </form>
    
    @if(isset($attendances))
        <table class="table table-bordered mt-4">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                @foreach($attendances as $studentId => $records)
                    <tr>
                        <td>{{ $records->first()->student->name }}</td>
                        <td>{{ $records->where('status', 'present')->count() }}</td>
                        <td>{{ $records->where('status', 'absent')->count() }}</td>
                        <td>{{ $records->where('status', 'late')->count() }}</td>
                        <td>{{ round($records->where('status', 'present')->count() / $records->count() * 100, 2) }}%</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>
@endsection
