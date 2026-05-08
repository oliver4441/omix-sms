<!DOCTYPE html>
<html>
<head>
    <title>Combined Report</title>
    <style>
        body { font-family: Arial; }
        .section { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>{{ $student->name }} - Combined Report</h1>
    <p>Class: {{ $student->class->name }}</p>
    
    <div class="section">
        <h2>Marksheet Summary</h2>
        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                </tr>
            </thead>
            <tbody>
                <!-- Add marksheet data here -->
                <tr><td colspan="3">Marksheet data loading...</td></tr>
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h2>Attendance Summary</h2>
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Rate</th>
                </tr>
            </thead>
            <tbody>
                <!-- Add attendance summary here -->
                <tr><td colspan="5">Attendance data loading...</td></tr>
            </tbody>
        </table>
    </div>
    
    <p>Generated on: {{ date('Y-m-d H:i') }}</p>
</body>
</html>
