import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const schoolId = (session.user as any).schoolId;

    // Base where clauses scoped by schoolId
    const feeWhere: Record<string, unknown> = {};
    const studentWhere: Record<string, unknown> = { status: "active" };
    const structureWhere: Record<string, unknown> = {};

    if (schoolId) {
      feeWhere.schoolId = schoolId;
      studentWhere.schoolId = schoolId;
      structureWhere.schoolId = schoolId;
    }

    const currentYear = new Date().getFullYear().toString();

    const [
      totalCollectedResult,
      activeStudents,
      recentPaymentsRaw,
      allFeeStructures,
      allStudents,
      studentPayments,
    ] = await Promise.all([
      // Sum of all FeePayment amounts
      prisma.feePayment.aggregate({
        where: Object.keys(feeWhere).length > 0 ? feeWhere : undefined,
        _sum: { amount: true },
      }),

      // Count of active students
      prisma.student.count({
        where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
      }),

      // Last 10 FeePayments with student info
      prisma.feePayment.findMany({
        where: Object.keys(feeWhere).length > 0 ? feeWhere : undefined,
        take: 10,
        orderBy: { paymentDate: "desc" },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              admissionNo: true,
            },
          },
          feeStructure: {
            select: { id: true, name: true, amount: true, frequency: true },
          },
          user: {
            select: { id: true, name: true },
          },
        },
      }),

      // All fee structures
      prisma.feeStructure.findMany({
        where: Object.keys(structureWhere).length > 0 ? structureWhere : undefined,
      }),

      // All active students (for balance computation)
      prisma.student.findMany({
        where: {
          ...(schoolId ? { schoolId } : {}),
          status: "active",
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          admissionNo: true,
        },
      }),

      // All payments grouped by student
      prisma.feePayment.findMany({
        where: {
          ...(Object.keys(feeWhere).length > 0 ? feeWhere : {}),
        },
        select: {
          studentId: true,
          amount: true,
          academicYear: true,
        },
      }),
    ]);

    // Build student -> total paid map
    const studentPaidMap = new Map<string, number>();
    const studentCurrentYearPaid = new Map<string, number>();
    studentPayments.forEach((p) => {
      const current = studentPaidMap.get(p.studentId) || 0;
      studentPaidMap.set(p.studentId, current + p.amount);
      if (p.academicYear === currentYear) {
        const cy = studentCurrentYearPaid.get(p.studentId) || 0;
        studentCurrentYearPaid.set(p.studentId, cy + p.amount);
      }
    });

    // Count pending: students with active fee structures but no payment at all
    const studentsWithStructures = new Set(
      allFeeStructures.map((fs) => fs.id)
    );
    // We consider a student "pending" if they have at least one fee structure
    // assigned to their class (or general structures) but no payments.
    // Simplified: count students who have no payments recorded
    const pendingPayments = allStudents.length - studentPaidMap.size;

    // Defaulters: students with zero payments in current academic year
    const defaulters = allStudents.filter(
      (s) => !studentCurrentYearPaid.has(s.id) || studentCurrentYearPaid.get(s.id) === 0
    );

    // Build defaulters list with balances (total fee obligation - paid)
    // For simplicity, sum of all fee structure amounts as obligation
    const totalObligationPerStudent = allFeeStructures.reduce(
      (sum, fs) => sum + fs.amount,
      0
    );

    const defaultersList = defaulters.map((s) => {
      const paid = studentPaidMap.get(s.id) || 0;
      const balance = Math.max(0, totalObligationPerStudent - paid);
      return {
        id: s.id,
        student: `${s.firstName} ${s.lastName}`,
        admissionNo: s.admissionNo,
        balance,
        academicYear: currentYear,
      };
    });

    return NextResponse.json({
      totalCollected: totalCollectedResult._sum.amount || 0,
      pendingPayments,
      defaulters: defaulters.length,
      activeStudents,
      recentPayments: recentPaymentsRaw.map((p) => ({
        id: p.id,
        amount: p.amount,
        method: p.method,
        term: p.term,
        academicYear: p.academicYear,
        paymentDate: p.paymentDate.toISOString(),
        student: {
          id: p.student.id,
          firstName: p.student.firstName,
          lastName: p.student.lastName,
          admissionNo: p.student.admissionNo,
        },
        feeStructure: p.feeStructure,
        recordedBy: p.user?.name || "Unknown",
      })),
      defaultersList: defaultersList.filter((d) => d.balance > 0).slice(0, 20),
    });
  } catch (error) {
    console.error("Error fetching bursar stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch bursar stats" },
      { status: 500 }
    );
  }
}
