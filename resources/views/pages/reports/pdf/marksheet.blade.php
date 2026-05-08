<!DOCTYPE html>
<html>
<head>
    <title>Marksheet Report</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>{{ $student->name }} - Marksheet Report</h1>
    <p>Class: {{ $student->class->name }}</p>
    <!-- Add marksheet details here -->
    <table>
        <thead>
            <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Grade</th>
            </tr>
        </thead>
        <tbody>
            <!-- Loop through subjects and marks -->
        </tbody>
    </table>
    <p>Generated on: {{ date('Y-m-d') }}</p>
</body>
</html>
