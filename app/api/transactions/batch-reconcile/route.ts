import { getUserSessionId } from "@/app/lib/sessionHelpers";
import {
  calculateBudgetDelta,
  markMatchedTransactionsAsReconciled,
} from "@/controllers/reconcileController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = await getUserSessionId(req);
  if (userId instanceof NextResponse) {
    return userId;
  }

  try {
    const { transactions, accountId, pullIncome } = await req.json();

    const { matchedTransactions, unmatchedTransactions } =
      await calculateBudgetDelta(userId, transactions, accountId, pullIncome);
    return NextResponse.json({ matchedTransactions, unmatchedTransactions });
  } catch (error) {
    console.error("Error occurred while reconciling transactions:", error);
    return NextResponse.json(
      { error: "An error occurred while reconciling transactions." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const userId = await getUserSessionId(req);
  if (userId instanceof NextResponse) {
    return userId;
  }

  try {
    const { transactions } = await req.json();

    await markMatchedTransactionsAsReconciled(transactions, userId);

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(
      "Error occured while batch reconciling transactions",
      (error as Error).message,
    );
    return NextResponse.json(
      { error: "Error occured while batch reconciling transactions" },
      { status: 500 },
    );
  }
}
