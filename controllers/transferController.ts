import { TransferDTO } from "@/app/components/Dashboard/TransferEditorSchema";
import dbConnect from "@/app/lib/dbConnect";
import { findBudget } from "@/helpers/budgetHelpers";
import { Budget } from "@/models/budgetModel";
import mongoose from "mongoose";
import {
  createSavingsTransaction,
  deleteSavingsTransaction,
  updateSavingsTransaction,
} from "./savingsController";
import transferModel, { TransferModel } from "@/models/transferModel";

async function createTransfer(
  transferDto: TransferDTO,
  userId: mongoose.Types.ObjectId
) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const savingsTransaction = await createSavingsTransaction(userId, {
      name: transferDto.name,
      amount: parseFloat(transferDto.amount),
      date: new Date(transferDto.date),
      accountId: transferDto.savingsAccount,
      bucket: transferDto.savingsBucket,
      transactionType: transferDto.type,
    });

    const transfer = await transferModel.create({
      name: transferDto.name,
      amount: parseFloat(transferDto.amount),
      date: transferDto.date,
      transactionType: transferDto.type,
      account: transferDto.savingsAccount,
      bucket: transferDto.savingsBucket,
      savingsTransferId: savingsTransaction._id,
      budgetId: budget._id,
      createdBy: userId,
      updatedBy: userId,
    });

    await budget.updateOne({
      $push: {
        transfers: transfer._id,
      },
    });

    await budget.save();

    return transfer;
  } catch (error) {
    throw error;
  }
}

async function updateTransfer(
  transferDto: Partial<TransferDTO>,
  transferId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const returnedTransfer = (await transferModel.findById(
      transferId
    )) as TransferModel;

    if (
      (budget._id as mongoose.Types.ObjectId).toString() !==
      returnedTransfer.budgetId.toString()
    ) {
      throw "Transfer not in user budget";
    }

    await updateSavingsTransaction(
      userId,
      returnedTransfer.savingsTransferId.toString(),
      {
        name: transferDto.name || returnedTransfer.name,
        amount: transferDto.amount
          ? parseFloat(transferDto.amount)
          : returnedTransfer.amount,
        date: transferDto.date
          ? new Date(transferDto.date)
          : new Date(returnedTransfer.date),
        accountId: returnedTransfer.account.toString(),
        bucket: transferDto.savingsBucket || returnedTransfer.bucket.toString(),
        transactionType: transferDto.type || returnedTransfer.transactionType,
      }
    );

    const updatedTransfer = await transferModel.findByIdAndUpdate(
      transferId,
      {
        $set: {
          name: transferDto.name || returnedTransfer.name,
          amount: transferDto.amount
            ? parseFloat(transferDto.amount)
            : returnedTransfer.amount,
          date: transferDto.date
            ? new Date(transferDto.date)
            : new Date(returnedTransfer.date),
          account: returnedTransfer.account.toString(),
          bucket:
            transferDto.savingsBucket || returnedTransfer.bucket.toString(),
          transactionType: transferDto.type || returnedTransfer.transactionType,
          updatedBy: userId,
        },
      },
      { new: true }
    );

    return updatedTransfer;
  } catch (error) {
    throw error;
  }
}

async function deleteTransfer(
  transferId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const deletedTransfer = (await transferModel.findOneAndDelete({
      _id: transferId,
      budgetId: budget._id,
    })) as TransferModel;

    if (!deletedTransfer) {
      throw `Transfer with ID ${transferId} was not found on the user's budget.`;
    }

    await deleteSavingsTransaction(
      userId,
      deletedTransfer.account,
      deletedTransfer.savingsTransferId.toString()
    );

    await budget.updateOne({
      $pull: { transfers: deletedTransfer._id },
    });

    await budget.save();

    return deletedTransfer;
  } catch (error) {
    throw error;
  }
}

export { createTransfer, updateTransfer, deleteTransfer };
