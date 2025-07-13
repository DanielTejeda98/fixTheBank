import { getDb } from '../migrations-utils/db';

export const up = async () => {
  const db = await getDb();
  await db.collection("expenses").updateMany({}, [
   {
      $addFields: {
         borrowFromNextMonth: { $ne: ["$date", "$transactionDate"] }
      }
   }
  ]);
};

export const down = async () => {
  const db = await getDb();
  db.collection("expenses").updateMany({}, { $unset: { borrowFromNextMonth: "" }});
};