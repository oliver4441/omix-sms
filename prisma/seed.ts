import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@omixsystems.com" },
    update: {},
    create: {
      email: "admin@omixsystems.com",
      name: "System Admin",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log(`✅ Admin created: admin@omixsystems.com / admin123`);

  // Create teacher user
  const teacherPassword = await bcrypt.hash("teacher123", 12);
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@omixsystems.com" },
    update: {},
    create: {
      email: "teacher@omixsystems.com",
      name: "Jane Teacher",
      password: teacherPassword,
      role: "teacher",
    },
  });
  console.log(`✅ Teacher created: teacher@omixsystems.com / teacher123`);

  // Create sample teachers
  const t1 = await prisma.teacher.create({
    data: {
      employeeNo: "TCH001",
      firstName: "Grace",
      lastName: "Mwangi",
      gender: "female",
      email: "grace.mwangi@omixschool.com",
      phone: "+254712345678",
      qualification: "B.Ed. Mathematics",
      specialization: "Mathematics",
    },
  });

  const t2 = await prisma.teacher.create({
    data: {
      employeeNo: "TCH002",
      firstName: "Peter",
      lastName: "Kamau",
      gender: "male",
      email: "peter.kamau@omixschool.com",
      phone: "+254723456789",
      qualification: "B.Ed. English",
      specialization: "English Language",
    },
  });

  const t3 = await prisma.teacher.create({
    data: {
      employeeNo: "TCH003",
      firstName: "Sarah",
      lastName: "Ochieng",
      gender: "female",
      email: "sarah.ochieng@omixschool.com",
      phone: "+254734567890",
      qualification: "M.Sc. Physics",
      specialization: "Sciences",
    },
  });

  // Create classes
  const c1 = await prisma.class.create({
    data: {
      name: "Grade 8 Alpha",
      code: "G8A-2026",
      academicYear: "2026",
      capacity: 40,
      teacherId: t1.id,
    },
  });

  const c2 = await prisma.class.create({
    data: {
      name: "Grade 8 Beta",
      code: "G8B-2026",
      academicYear: "2026",
      capacity: 40,
      teacherId: t2.id,
    },
  });

  const c3 = await prisma.class.create({
    data: {
      name: "Grade 7 Alpha",
      code: "G7A-2026",
      academicYear: "2026",
      capacity: 35,
      teacherId: t3.id,
    },
  });

  // Create subjects
  const subjects = await Promise.all([
    prisma.subject.create({ data: { name: "Mathematics", code: "MATH", category: "core", teacherId: t1.id, classId: c1.id } }),
    prisma.subject.create({ data: { name: "English", code: "ENG", category: "core", teacherId: t2.id, classId: c1.id } }),
    prisma.subject.create({ data: { name: "Kiswahili", code: "KISW", category: "core", classId: c1.id } }),
    prisma.subject.create({ data: { name: "Science", code: "SCI", category: "core", teacherId: t3.id, classId: c1.id } }),
    prisma.subject.create({ data: { name: "Social Studies", code: "SST", category: "core", classId: c1.id } }),
    prisma.subject.create({ data: { name: "CRE", code: "CRE", category: "core", classId: c2.id } }),
    prisma.subject.create({ data: { name: "Computer Science", code: "COMP", category: "elective" } }),
  ]);

  // Create students
  const studentNames = [
    ["Brian", "Kiprop"], ["Cynthia", "Wanjiku"], ["Daniel", "Omondi"],
    ["Esther", "Wambui"], ["Felix", "Mutua"], ["Grace", "Akinyi"],
    ["Henry", "Njoroge"], ["Irene", "Chebet"], ["James", "Mwangi"],
    ["Kevin", "Otieno"], ["Lynn", "Nyambura"], ["Michael", "Kiprono"],
    ["Nancy", "Wairimu"], ["Oscar", "Kipkemboi"], ["Phyllis", "Jerono"],
    ["Samuel", "Kimani"], ["Teresia", "Njeri"], ["Victor", "Okoth"],
    ["Winnie", "Achieng"], ["Zachary", "Maina"],
  ];

  const students = [];
  for (let i = 0; i < studentNames.length; i++) {
    const [first, last] = studentNames[i];
    const student = await prisma.student.create({
      data: {
        admissionNo: `ADM${String(i + 1).padStart(4, "0")}`,
        firstName: first,
        lastName: last,
        gender: i % 2 === 0 ? "male" : "female",
        dateOfBirth: new Date(2011 + Math.floor(i / 3), i % 12, (i % 28) + 1),
        guardianName: `Mr./Mrs. ${last}`,
        guardianPhone: `+2547${String(10000000 + i * 100000).slice(0, 9)}`,
        address: `${i + 1} Nairobi Street`,
      },
    });
    students.push(student);
  }

  // Enroll students
  const classes = [c1, c2, c3];
  for (let i = 0; i < students.length; i++) {
    const classIdx = i % 3;
    await prisma.enrollment.create({
      data: {
        studentId: students[i].id,
        classId: classes[classIdx].id,
        academicYear: "2026",
      },
    });
  }

  // Create exam
  const exam = await prisma.exam.create({
    data: {
      name: "End of Term 1 Examination",
      term: "Term 1",
      academicYear: "2026",
      startDate: new Date("2026-04-14"),
      endDate: new Date("2026-04-25"),
      description: "Comprehensive end of term assessment covering all subjects.",
    },
  });

  // Create some grades
  for (let i = 0; i < Math.min(students.length, 10); i++) {
    for (const subj of subjects.slice(0, 4)) {
      const score = Math.round(40 + Math.random() * 60);
      const grade = score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : score >= 50 ? "D" : "E";
      await prisma.grade.create({
        data: {
          studentId: students[i].id,
          subjectId: subj.id,
          examId: exam.id,
          classId: classes[i % 3].id,
          score,
          grade,
        },
      });
    }
  }

  // Create fee structures
  const tuition = await prisma.feeStructure.create({
    data: { name: "Tuition Fee", amount: 25000, frequency: "term", academicYear: "2026" },
  });
  const transport = await prisma.feeStructure.create({
    data: { name: "Transport Fee", amount: 8000, frequency: "term", academicYear: "2026" },
  });
  const lunch = await prisma.feeStructure.create({
    data: { name: "Lunch Program", amount: 5000, frequency: "term", academicYear: "2026" },
  });

  // Some sample payments
  const paymentMethods = ["mpesa", "cash", "bank"];
  for (let i = 0; i < 8; i++) {
    await prisma.feePayment.create({
      data: {
        feeStructureId: tuition.id,
        studentId: students[i].id,
        userId: admin.id,
        amount: 25000,
        paymentDate: new Date(2026, 0, 15 + i * 2),
        method: paymentMethods[i % 3],
        term: "Term 1",
        academicYear: "2026",
      },
    });
  }

  // Timetable entries
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = [
    ["08:00", "08:45"], ["08:45", "09:30"], ["09:45", "10:30"],
    ["10:30", "11:15"], ["11:30", "12:15"], ["12:15", "13:00"],
  ];

  for (let dayIdx = 0; dayIdx < 5; dayIdx++) {
    for (let slotIdx = 0; slotIdx < 4; slotIdx++) {
      const subjIdx = (dayIdx * 4 + slotIdx) % subjects.length;
      await prisma.timetable.create({
        data: {
          classId: c1.id,
          subjectId: subjects[subjIdx].id,
          dayOfWeek: dayIdx,
          startTime: times[slotIdx][0],
          endTime: times[slotIdx][1],
          room: `Room ${100 + slotIdx + 1}`,
        },
      });
    }
  }

  // Announcements
  await prisma.announcement.create({
    data: {
      title: "Welcome to Term 1, 2026",
      content: "We welcome all students and staff to a new academic year. Classes begin on Monday, January 13th, 2026. All students must report by 7:45 AM.",
      authorId: admin.id,
      priority: "high",
      target: "all",
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Staff Meeting - Friday",
      content: "There will be a staff meeting this Friday at 2:30 PM in the staff room. Attendance is mandatory for all teaching staff.",
      authorId: admin.id,
      priority: "normal",
      target: "teachers",
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Science Fair Registration Open",
      content: "Registration for the annual Science Fair is now open. Interested students should see Mr. Ochieng in the science lab by February 10th.",
      authorId: admin.id,
      priority: "normal",
      target: "all",
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin:  admin@omixsystems.com / admin123");
  console.log("   Teacher: teacher@omixsystems.com / teacher123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
