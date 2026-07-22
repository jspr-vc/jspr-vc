import { revalidatePath } from "next/cache";
import { getFirstPortfolio } from "@/queries";

/*
 * Revalidate the static "/" home page when the given portfolio is the one
 * rendered there (see getFirstPortfolio / DEFAULT_PORTFOLIO_ID).
 */
export async function revalidateHomeIfDefault(portfolioId: number) {
  const defaultPortfolio = await getFirstPortfolio();
  if (defaultPortfolio?.id === portfolioId) {
    revalidatePath("/");
  }
}
