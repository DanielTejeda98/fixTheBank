import { getDb } from '../migrations-utils/db';

export const up = async () => {
   const db = await getDb();
   /*
       Code your update script here!
    */
   db.collection("expenses").updateMany({}, [
      {
         $set: {
            transactionDate: "$date"
         }
      }
   ])
};

export const down = async () => {
   const db = await getDb();
   /*
       Code you downgrade script here!
    */
   db.collection("expenses").updateMany({}, [
      {
         $unset: {
            transactionDate: ""
         }
      }
   ])
};