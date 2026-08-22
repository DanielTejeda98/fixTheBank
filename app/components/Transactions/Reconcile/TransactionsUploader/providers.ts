import { BankTransaction } from "@/types/budget";
import Papa from "papaparse";

const getCompanyUrl = (name: string) =>
  `https://img.logo.dev/name/${encodeURIComponent(name)}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_PK}`;

const TRANSACTION_TYPE = {
  PAYMENT: "Payment",
  SALE: "Sale",
  REFUND: "Refund",
} as const;

function getDiscoverType(description: string, category: string): string {
  if (
    category.toLowerCase() === "payments and credits" &&
    description.toLowerCase().includes("payment - thank you")
  ) {
    return TRANSACTION_TYPE.PAYMENT;
  }
  return TRANSACTION_TYPE.SALE;
}

function getCapitalOneType(description: string, category: string): string {
  if (
    category.toLowerCase() === "payment/credit" &&
    description.toLowerCase().includes("pymt")
  ) {
    return TRANSACTION_TYPE.PAYMENT;
  }
  return TRANSACTION_TYPE.SALE;
}

export const providers = [
  {
    id: "chase",
    name: "JP Morgan Chase",
    logoUrl: getCompanyUrl("chase"),
    csvTransformer: async (csvData: File, pullCCPayment: boolean) => {
      // Implement the transformation logic for Chase CSV data here
      // Return the transformed data in the desired format
      return new Promise<BankTransaction[]>((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) =>
            resolve(
              results.data
                .map((row: any) => ({
                  date: row["Transaction Date"] || row["Posting Date"],
                  amount: parseFloat(row["Amount"]),
                  description: row["Description"],
                  type: row["Type"],
                }))
                .filter((transaction) => {
                  if (pullCCPayment) {
                    return true;
                  }

                  if (transaction.type === TRANSACTION_TYPE.PAYMENT) {
                    return false;
                  }

                  return true;
                }),
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
    csvTransformer: async (csvData: File, pullCCPayment: boolean) => {
      // Implement the transformation logic for Discover CSV data here
      // Return the transformed data in the desired format
      return new Promise<BankTransaction[]>((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) =>
            resolve(
              results.data
                .map((row: any) => ({
                  date: row["Trans. Date"],
                  amount: row["Amount"],
                  description: row["Description"],
                  type: getDiscoverType(row["Description"], row["Category"]),
                }))
                .filter((transaction) => {
                  if (pullCCPayment) {
                    return true;
                  }

                  if (transaction.type === TRANSACTION_TYPE.PAYMENT) {
                    return false;
                  }

                  return true;
                }),
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
    csvTransformer: async (csvData: File, pullCCPayment: boolean) => {
      // Implement the transformation logic for Capital One CSV data here
      // Return the transformed data in the desired format
      return new Promise<BankTransaction[]>((resolve, reject) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) =>
            resolve(
              results.data
                .map((row: any) => ({
                  date: row["Transaction Date"],
                  amount: row["Debit"] || row["Credit"],
                  description: row["Description"],
                  type: getCapitalOneType(row["Description"], row["Category"]),
                }))
                .filter((transaction) => {
                  if (pullCCPayment) {
                    return true;
                  }

                  if (transaction.type === TRANSACTION_TYPE.PAYMENT) {
                    return false;
                  }

                  return true;
                }),
            ),
          error: (error) => reject(error),
        });
      });
    },
  },
];
