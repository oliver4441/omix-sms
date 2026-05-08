@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Mark Attendance</h2>
    
    <form method="POST" action="{{ route('attendance.store') }}">
        @csrf
        
        <div class="form-group">
            <label>Class</label>
            <select name="class_id" class="form-control" required>
                <option value="">Select Class</option>
                @foreach($classes as $class)
                    <option value="{{ $class->id }}">{{ $class->name }}</option>
                @endforeach
            </select>
        </div>
        
        <div class="form-group">
            <label>Date</label>
            <input type="date" name="date" class="form-control" value="{{ date('Y-m-d') }}" required>
        </div>
        
        <div id="students-list">
            <!-- Students will be loaded via AJAX based on class selection -->
        </div>
        
        <button type="submit" class="btn btn-primary">Save Attendance</button>
    </form>
</div>
@endsection
