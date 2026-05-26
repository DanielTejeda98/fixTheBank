import { TemplateSchema } from "@/app/components/Settings/Templates/TemplateSchema";
import dbConnect from "@/app/lib/dbConnect";
import { findBudget } from "@/helpers/budgetHelpers";
import { Budget } from "@/models/budgetModel";
import templateModel from "@/models/templateModel";
import userModel from "@/models/userModel";
import mongoose from "mongoose";

async function getAllBudgetTemplates(userId: mongoose.Types.ObjectId) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const templates = await templateModel.find({ budgetId: budget._id });

    return templates;
  } catch (error) {
    throw error;
  }
}

async function getTemplateById(
  templateId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const template = await templateModel.findOne({
      _id: templateId,
      budgetId: budget._id,
    });

    if (!template) {
      throw new Error("Template not found");
    }

    return template;
  } catch (error) {
    throw error;
  }
}

async function createTemplate(
  templateDto: TemplateSchema,
  userId: mongoose.Types.ObjectId,
) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const template = await templateModel.create({
      name: templateDto.name,
      description: templateDto.description,
      type: templateDto.type,
      data: getTemplateData(templateDto),
      recurringSettings: templateDto.recurringSettings
        ? {
            frequency: templateDto.recurringSettings.frequency,
            endCondition: templateDto.recurringSettings.endCondition,
            occurrences: templateDto.recurringSettings.occurrences,
            endDate: templateDto.recurringSettings.endDate,
          }
        : null,
      budgetId: budget._id,
      createdBy: userId,
      updatedBy: userId,
    });

    budget.templates.push(template._id);

    await budget.save();

    return template;
  } catch (error) {
    throw error;
  }
}

async function updateTemplate(
  templateDto: Partial<TemplateSchema>,
  templateId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const updateFields = {
      name: templateDto.name,
      description: templateDto.description,
      type: templateDto.type,
      recurringSettings: templateDto.recurringSettings
        ? {
            frequency: templateDto.recurringSettings.frequency,
            endCondition: templateDto.recurringSettings.endCondition,
            occurrences: templateDto.recurringSettings.occurrences,
            endDate: templateDto.recurringSettings.endDate,
          }
        : null,
      data: getTemplateData(templateDto as TemplateSchema),
      updatedBy: userId,
      updatedAt: new Date(),
    };

    const updatedTemplate = await templateModel.findOneAndUpdate(
      { _id: templateId, budgetId: budget._id },
      updateFields,
      { new: true },
    );

    if (!updatedTemplate) {
      throw new Error("Template not found");
    }

    return updatedTemplate;
  } catch (error) {
    throw error;
  }
}

async function deleteTemplate(
  templateId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const deletedTemplate = await templateModel.findOneAndDelete({
      _id: templateId,
      budgetId: budget._id,
    });

    if (!deletedTemplate) {
      throw new Error("Template not found");
    }

    await budget.updateOne({
      $pull: { templates: deletedTemplate._id },
    });

    await budget.save();

    return deletedTemplate;
  } catch (error) {
    throw error;
  }
}

async function userPinTemplate(
  templateId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.budgetConfigurations) {
      user.budgetConfigurations = [
        {
          budgetId: budget._id,
          pinnedTemplates: [templateId],
        },
      ];
    }

    const userBudgetConfig = user.budgetConfigurations?.find((config: any) =>
      config.budgetId.equals(budget._id),
    );
    if (!userBudgetConfig) {
      user.budgetConfigurations.push({
        budgetId: budget._id,
        pinnedTemplates: [templateId],
      });
      await user.save();
      return [templateId];
    }

    if (!userBudgetConfig.pinnedTemplates.includes(templateId)) {
      userBudgetConfig.pinnedTemplates.push(templateId);
      await user.save();
      return userBudgetConfig.pinnedTemplates;
    }

    await user.save();
    return userBudgetConfig.pinnedTemplates;
  } catch (error) {
    throw error;
  }
}

async function userUnpinTemplate(
  templateId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
) {
  try {
    await dbConnect();

    const budget = (await findBudget(userId)) as Budget;

    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const userBudgetConfig = user.budgetConfigurations?.find((config: any) =>
      config.budgetId.equals(budget._id),
    );

    if (!userBudgetConfig) {
      return;
    }

    userBudgetConfig.pinnedTemplates = userBudgetConfig.pinnedTemplates.filter(
      (id: mongoose.Types.ObjectId) => !id.equals(templateId),
    );

    await user.save();
    return userBudgetConfig.pinnedTemplates;
  } catch (error) {
    throw error;
  }
}

async function getUserPinnedTemplates(
  userId: mongoose.Types.ObjectId,
  budgetId: mongoose.Types.ObjectId,
) {
  try {
    await dbConnect();

    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const userBudgetConfig = user.budgetConfigurations?.find((config: any) =>
      config.budgetId.equals(budgetId),
    );

    if (!userBudgetConfig) {
      return [];
    }

    return userBudgetConfig.pinnedTemplates;
  } catch (error) {
    throw error;
  }
}

function getTemplateData(templateDto: TemplateSchema): any {
  switch (templateDto.type) {
    case "expense":
      return templateDto.expenseSchema;
    case "income":
      return templateDto.incomeSchema;
    case "transfer":
      return templateDto.transferSchema;
    default:
      throw new Error("Invalid template type");
  }
}

export {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getAllBudgetTemplates,
  getTemplateById,
  userPinTemplate,
  userUnpinTemplate,
  getUserPinnedTemplates,
};
