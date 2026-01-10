import { getYearInReviewData } from "@/app/lib/getYearInReviewData";
import YearInReview from "@/app/components/YearInReview/YearInReview";

export default async function YearInReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ year: string }>;
}) {
  const { year } = await searchParams;
  const yearInReviewData = await getYearInReviewData(
    year || (new Date().getFullYear() - 1).toString()
  );

  if (!yearInReviewData) return null;

  return <YearInReview yearInReviewData={yearInReviewData} />;
}
