import { getDb } from '../migrations-utils/db';

export const up = async () => {
  const db = await getDb();
  db.collection("categories").updateMany({}, [
    {
      $set: {
        notes: []
      }
    }
   ])
};

export const down = async () => {
  const db = await getDb();
  db.collection("categories").updateMany({}, [
      {
         $unset: {
            notes: ""
         }
      }
   ])
};