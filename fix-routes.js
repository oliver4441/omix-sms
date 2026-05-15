// Fix all remaining files with relation syntax back to scalar schoolId
// Using sed for efficiency across all files

const { execSync } = require('child_process');
const path = require('path');

const base = '/home/oliver/omix-sms/src/app/api';

// Replace relation connect syntax back to scalar in ALL route files
const replaceMap = [
  // attendance
  { file: `${base}/attendance/route.ts`,
    old: '...(schoolId ? { school: { connect: { id: schoolId } } } : {}),',
    new: '...(schoolId ? { schoolId } : {}),' },

  // students
  { file: `${base}/students/route.ts`,
    old: '...(schoolId ? { school: { connect: { id: schoolId } } } : {}),',
    new: '...(schoolId ? { schoolId } : {}),' },

  // fees
  { file: `${base}/fees/route.ts`,
    old: '...(schoolId ? { school: { connect: { id: schoolId } } } : {}),',
    new: '...(schoolId ? { schoolId } : {}),' },

  // fee structures
  { file: `${base}/fees/structures/route.ts`,
    old: '...(schoolId ? { school: { connect: { id: schoolId } } } : {}),',
    new: '...(schoolId ? { schoolId } : {}),' },

  // exams
  { file: `${base}/exams/route.ts`,
    old: '...(schoolId ? { school: { connect: { id: schoolId } } } : {}),',
    new: '...(schoolId ? { schoolId } : {}),' },

  // dashboard stats
  { file: `${base}/dashboard/stats/route.ts`,
    old: '...(schoolId ? { school: { connect: { id: schoolId } } } : {}),',
    new: '...(schoolId ? { schoolId } : {}),' },

  // classes create
  { file: `${base}/classes/route.ts`,
    old: '...(schoolId ? { school: { connect: { id: schoolId } } } : {}),\n          include:',
    new: '...(schoolId ? { schoolId } : {}),\n          include:' },

  // classes [id] - teacher connect
  { file: `${base}/classes/[id]/route.ts`,
    old: '...(data.teacherId === undefined\n          ? {}\n          : data.teacherId\n          ? { teacher: { connect: { id: data.teacherId } } }\n          : { teacher: { disconnect: true } }),',
    new: '...(data.teacherId !== undefined && { teacherId: data.teacherId }),' },
];

replaceMap.forEach(({ file, old, new: newStr }) => {
  try {
    const content = require('fs').readFileSync(file, 'utf8');
    if (content.includes(old)) {
      require('fs').writeFileSync(file, content.replace(old, newStr));
      console.log(`Fixed: ${path.basename(file)}`);
    } else {
      console.log(`Skip (no match): ${path.basename(file)}`);
    }
  } catch(e) {
    console.error(`Error: ${file}: ${e.message}`);
  }
});

console.log('\nDone!');