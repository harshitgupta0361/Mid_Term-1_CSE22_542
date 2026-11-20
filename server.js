
const express = require('express');

const app = express();
app.use(express.json());

const PORT = 3000;


let students = [];
let nextId = 1;


function validateStudent(data) {
    if (
        !data ||
        typeof data.name !== 'string' ||
        !data.name.trim() ||
        typeof data.course !== 'string' ||
        !data.course.trim() ||
        typeof data.age !== 'number' ||
        !Number.isFinite(data.age)
    ) {
        return false;
    }

    return true;
}


app.post('/api/students', (req, res) => {
    const { name, course, age } = req.body;

    if (!validateStudent(req.body)) {
        return res.status(400).json({
            message: 'Missing or invalid student data'
        });
    }

    
    const exists = students.find(
        s => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: 'Student name already exists'
        });
    }

    const newStudent = {
        id: nextId++,
        name: name.trim(),
        course: course.trim(),
        age: age
    };

    students.push(newStudent);

    res.status(201).json({
        message: 'Student added successfully',
        student: newStudent
    });
});


// 2. GET - Get all students (with course filter)
app.get('/api/students', (req, res) => {
    const { course } = req.query;

    let result = students;

    if (course) {
        result = students.filter(
            s => s.course.toLowerCase() === course.toLowerCase()
        );
    }

    res.status(200).json(result);
});


// 3. GET - Get student by ID
app.get('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    res.status(200).json(student);
});


// 4. PUT - Update student by ID
app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    if (!validateStudent(req.body)) {
        return res.status(400).json({
            message: 'Missing or invalid student data'
        });
    }

    const { name, course, age } = req.body;

    // Check duplicate name (excluding current student)
    const exists = students.find(
        s =>
            s.id !== id &&
            s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: 'Student name already exists'
        });
    }

    student.name = name.trim();
    student.course = course.trim();
    student.age = age;

    res.status(200).json({
        message: 'Student updated successfully',
        student: student
    });
});


// 5. DELETE - Delete student by ID
app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const deletedStudent = students.splice(index, 1);

    res.status(200).json({
        message: 'Student deleted successfully',
        student: deletedStudent[0]
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
