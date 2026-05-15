import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const chatSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

const BASE_PROMPT = `You are omixsystems AI — the intelligent assistant for the omixsystems School Management System. You can help with school-related tasks like generating reports, answering questions about education, analyzing student data, and assisting with administrative work.

Guidelines:
- Be concise and professional
- When discussing data, use the actual numbers provided in context
- If you don't have enough data to answer accurately, say so clearly
- Do NOT reveal user passwords or sensitive credentials
- For report generation requests, ask what data they'd like included`;

async function buildSystemPrompt(role: string, schoolId: string | null, userId: string): Promise<string> {
  const base = `${BASE_PROMPT}\n\nUser Role: ${role}`;

  if (role === "super_admin") {
    const [schoolCount, userCount, activeSchools] = await Promise.all([
      prisma.school.count(),
      prisma.user.count(),
      prisma.school.count({ where: { isActive: true } }),
    ]);

    return `${base}
Your Role: System Super Administrator
Scope: All schools across the platform

Platform Overview:
- Total Schools: ${schoolCount}
- Active Schools: ${activeSchools}
- Total Users: ${userCount}

You can help with:
- Platform-wide analytics and insights
- School management guidance
- System administration advice
- Cross-school reports and comparisons`;
  }

  if (!schoolId) return base;

  // School-level users (school_admin, teacher)
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: {
      name: true,
      slug: true,
      _count: { select: { students: true, teachers: true, classes: true } },
    },
  });

  if (!school) return base;

  const schoolContext = `
School: ${school.name} (${school.slug})
Students: ${school._count.students}
Teachers: ${school._count.teachers}
Classes: ${school._count.classes}`;

  if (role === "school_admin") {
    // Fetch department summary data for the principal dashboard
    const [departmentCount, subjectCount, performanceCount, libraryData, labData, feeData, boardMeetings] = await Promise.all([
      prisma.department.count({ where: { schoolId } }),
      prisma.subject.count({ where: { schoolId } }),
      prisma.subjectPerformance.count({ where: { schoolId } }),
      prisma.libraryBook.aggregate({
        where: { schoolId },
        _sum: { quantity: true, available: true },
      }).catch(() => ({ _sum: { quantity: 0, available: 0 } })),
      prisma.scienceApparatus.aggregate({
        where: { schoolId },
        _sum: { totalQuantity: true, broken: true, lost: true },
      }).catch(() => ({ _sum: { totalQuantity: 0, broken: 0, lost: 0 } })),
      Promise.all([
        prisma.feePayment.aggregate({
          where: { schoolId },
          _sum: { amount: true },
        }).catch(() => ({ _sum: { amount: 0 } })),
        prisma.feePayment.findMany({
          where: { schoolId },
          select: { studentId: true },
          distinct: ["studentId"],
        }).catch(() => []),
      ]),
      prisma.boardMeeting.count({
        where: { schoolId, status: { not: "completed" } },
      }).catch(() => 0),
    ]);

    // Count overdue book checkouts
    const overdueBooks = await prisma.bookCheckout.count({
      where: {
        schoolId,
        status: "active",
        dueDate: { lt: new Date() },
      },
    }).catch(() => 0);

    // Count fee defaulters
    const activeStudentsCount = await prisma.student.count({
      where: { schoolId, status: "active" },
    }).catch(() => 0);
    const paidStudents = feeData?.[1]?.length || 0;
    const feeDefaulters = Math.max(0, activeStudentsCount - paidStudents);

    const departmentContext = `
Department Overview:
- Total Departments: ${departmentCount}
- Total Subjects: ${subjectCount}
- Performance Records: ${performanceCount}
- Upcoming/Pending Board Meetings: ${boardMeetings}

Library Summary:
- Total Books: ${libraryData._sum.quantity || 0}
- Available Books: ${libraryData._sum.available || 0}
- Overdue Books: ${overdueBooks}

Science Lab Summary:
- Total Apparatus: ${labData._sum.totalQuantity || 0}
- Broken Items: ${labData._sum.broken || 0}
- Lost Items: ${labData._sum.lost || 0}

Fee Summary:
- Total Collected: $${((feeData?.[0] as any)?._sum?.amount || 0).toFixed(2)}
- Fee Defaulters: ${feeDefaulters} students`;

    return `${base}
${schoolContext}
${departmentContext}
Your Role: School Administrator (Principal)

As the principal, you have oversight of ALL departments in the school. You can answer questions about:
- Academic departments: subject performance, class mean scores, pass rates, exam analytics
- Library: book inventory, overdue books, checkout statistics
- Science Lab: apparatus status, broken/lost equipment, lab activity logs
- Bursar: fee collection summaries, payment trends, defaulters list
- Board of Management: upcoming meetings, minutes, suggestions, resolutions

You have access to tool-like capabilities for querying department data:
- library_stats: Get library usage metrics, overdue books, available books
- lab_stats: Get science lab apparatus status, broken and lost items
- board_info: Get meeting schedules, minutes, and suggestions
- fee_summaries: Get fee collection data and defaulter information
- performance_data: Get subject performance by class, term, and academic year

Proactive monitoring: When discussing school performance or answering general queries, proactively identify areas needing attention. For example:
- "The library has ${overdueBooks} overdue books."
- "The science lab has ${labData._sum.broken || 0} broken apparatus items."
- "${feeDefaulters} students are fee defaulters."
- Recommend actions for departments that need improvement.

Be concise but comprehensive when providing department-level insights.`;
  }

  if (role === "teacher") {
    // Find the teacher record linked to this user
    const teacherRecord = await prisma.teacher.findFirst({
      where: { schoolId },
      select: {
        firstName: true,
        lastName: true,
        specialization: true,
        _count: { select: { classes: true, subjects: true } },
      },
    });

    const teacherContext = teacherRecord
      ? `\nYour Profile: ${teacherRecord.firstName} ${teacherRecord.lastName}
Specialization: ${teacherRecord.specialization || "General"}
Classes Assigned: ${teacherRecord._count.classes}
Subjects Taught: ${teacherRecord._count.subjects}`
      : "";

    return `${base}
${schoolContext}${teacherContext}
Your Role: Teacher

You can help with:
- Lesson planning and teaching resources
- Student grade entry and progress tracking
- Class performance analysis
- Timetable and schedule questions
- Student behavior and academic guidance`;
  }

  return base;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = chatSchema.parse(body);

    const role = (session.user as any).role || "school_admin";
    const schoolId = (session.user as any).schoolId || null;
    const systemPrompt = await buildSystemPrompt(role, schoolId, session.user.id);

    const apiKey = process.env.OPENCODE_ZEN_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenCode Zen API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://opencode.ai/zen/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "nemotron-3-super-free",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI service returned an error", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse =
      data.choices?.[0]?.message?.content || "No response generated.";

    return NextResponse.json({
      reply: aiResponse,
      model: data.model || "openai/gpt-4o-mini",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Failed to process AI chat request" },
      { status: 500 }
    );
  }
}
