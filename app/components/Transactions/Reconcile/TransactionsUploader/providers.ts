import { BankTransaction } from "@/types/budget";
import Papa from "papaparse";

const getCompanyUrl = (name: string) =>
  `https://img.logo.dev/name/${encodeURIComponent(name)}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_PK}`;

export const providers = [
  {
    id: "chase",
    name: "JP Morgan Chase",
    logoUrl: getCompanyUrl("chase"),
    csvTransformer: async (csvData: File) => {
      // Implement the transformation logic for Chase CSV data here
      // Return the transformed data in the desired format
      return new Promise<BankTransaction[]>((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) =>
            resolve(
              results.data.map((row: any) => ({
                date: row["Transaction Date"] || row["Posting Date"],
                amount: parseFloat(row["Amount"]),
                description: row["Description"],
                type: row["Type"],
              })),
            ),
          error: (error) => reject(error),
        });
      });
    },
  },
  {
    id: "discover",
    name: "Discover",
    logoUrl: getCompanyUrl("discover"),
    csvTransformer: async (csvData: File) => {
      // Implement the transformation logic for Discover CSV data here
      // Return the transformed data in the desired format
      return new Promise<BankTransaction[]>((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) =>
            resolve(
              results.data.map((row: any) => ({
                date: row["Trans. Date"],
                amount: row["Amount"],
                description: row["Description"],
                type: "N/A",
              })),
            ),
          error: (error) => reject(error),
        });
      });
    },
  },
  {
    id: "capital-one",
    name: "Capital One",
    logoUrl: getCompanyUrl("capital one"),
    csvTransformer: async (csvData: File) => {
      // Implement the transformation logic for Discover CSV data here
      // Return the transformed data in the desired format
      return new Promise<BankTransaction[]>((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) =>
            resolve(
              results.data.map((row: any) => ({
                date: row["Transaction Date"],
                amount: row["Debit"] || row["Credit"],
                description: row["Description"],
                type: "N/A",
              })),
            ),
          error: (error) => reject(error),
        });
      });
    },
  },
];
