<!DOCTYPE html>
<html>
<head>
    <title>Attendance Report</title>
    <style>
        body { font-family: Arial; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>{{ $student->name }} - Attendance Report</h1>
    <p>Class: {{ $student->class->name }}</p>
    <p>Period: {{ request('month', date('Y-m')) }}</p>
    
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            @foreach($attendances as $attendance)
            <tr>
                <td>{{ $attendance->attendance_date->format('Y-m-d') }}</td>
                <td>{{ ucfirst($attendance->status) }}</td>
                <td>{{ $attendance->remarks ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <p><strong>Summary:</strong></p>
    <ul>
        <li>Present: {{ $attendances->where('status', 'present')->count() }}</li>
        <li>Absent: {{ $attendances->where('status', 'absent')->count() }}</li>
        <li>Late: {{ $attendances->where('status', 'late')->count() }}</li>
        <li>Attendance Rate: {{ round($attendances->where('status', 'present')->count() / $attendances->count() * 100, 2) }}%</li>
    </ul>
    
    <p>Generated on: {{ date('Y-m-d H:i') }}</p>
</body>
</html>
