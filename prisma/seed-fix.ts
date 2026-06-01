import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const school = await prisma.school.findFirst();
  if (!school) { console.log('No school found'); return; }
  const SID = school.id;

  const students = await prisma.student.findMany({ where: { schoolId: SID } });
  const classes = await prisma.class.findMany({ where: { schoolId: SID } });
  const subs = await prisma.subject.findMany({ where: { schoolId: SID } });
  const exams = await prisma.exam.findMany({ where: { schoolId: SID } });
  const admin = await prisma.user.findFirst({ where: { role: 'school_admin' } });

  if (!students.length || !classes.length || !subs.length || !exams.length) {
    console.log('Missing prerequisite data');
    return;
  }

  const exam = exams[0];

  // Grades
  let gradeCount = 0;
  for (let i = 0; i < Math.min(students.length, 8); i++) {
    for (const subj of subs.slice(0, 4)) {
      const score = Math.round(40 + Math.random() * 60);
      await prisma.grade.create({
        data: {
          student: { connect: { id: students[i].id } },
          subject: { connect: { id: subj.id } },
          exam: { connect: { id: exam.id } },
          class: { connect: { id: classes[i % 3].id } },
          score,
          grade: score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'E',
          school: { connect: { id: SID } },
        },
      });
      gradeCount++;
    }
  }
  console.log(`✅ ${gradeCount} grades created`);

  // Fee Structures
  const tu = await prisma.feeStructure.create({ data: { name: 'Tuition Fee', amount: 25000, academicYear: '2026', school: { connect: { id: SID } } } });
  await prisma.feeStructure.create({ data: { name: 'Transport Fee', amount: 8000, academicYear: '2026', school: { connect: { id: SID } } } });
  await prisma.feeStructure.create({ data: { name: 'Lunch Program', amount: 5000, academicYear: '2026', school: { connect: { id: SID } } } });
  console.log('✅ Fee structures created');

  // Fee Payments
  if (admin) {
    for (let i = 0; i < 5; i++) {
      await prisma.feePayment.create({
        data: {
          feeStructure: { connect: { id: tu.id } },
          student: { connect: { id: students[i].id } },
          user: { connect: { id: admin.id } },
          amount: 25000,
          paymentDate: new Date(2026, 0, 15 + i * 2),
          method: 'mpesa', term: 'Term 1', academicYear: '2026',
          school: { connect: { id: SID } },
        },
      });
    }
    console.log('✅ Fee payments created');
  }

  // Timetable
  const c1 = classes[0];
  let ttCount = 0;
  for (let d = 0; d < 5; d++) {
    for (let s = 0; s < 4; s++) {
      await prisma.timetable.create({
        data: {
          class: { connect: { id: c1.id } },
          subject: { connect: { id: subs[(d * 4 + s) % subs.length].id } },
          dayOfWeek: d, startTime: '08:00', endTime: '08:45', room: 'Room ' + (100 + s),
          school: { connect: { id: SID } },
        },
      });
      ttCount++;
    }
  }
  console.log(`✅ ${ttCount} timetable entries created`);

  // Announcements
  if (admin) {
    await prisma.announcement.create({
      data: { title: 'Welcome to Term 1, 2026', content: 'All students must report by 7:45 AM.', author: { connect: { id: admin.id } }, priority: 'high', target: 'all', school: { connect: { id: SID } } },
    });
    await prisma.announcement.create({
      data: { title: 'Staff Meeting - Friday', content: 'Staff meeting on Friday at 2:30 PM.', author: { connect: { id: admin.id } }, priority: 'normal', target: 'teachers', school: { connect: { id: SID } } },
    });
    console.log('✅ Announcements created');
  }

  // Summary
  console.log('\n📊 Data summary:');
  for (const t of ['Grade', 'FeeStructure', 'FeePayment', 'Timetable', 'Announcement']) {
    const count = await (prisma as any)[t.charAt(0).toLowerCase() + t.slice(1)].count();
    console.log(`   ${t}: ${count}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
