/**
 * prisma/seed.ts
 *
 * Per project requirements, Vinci AI ships with NO mock/sample data —
 * no fake users, fake collectibles, or fabricated market headlines.
 * This script exists only as the wiring `npm run db:seed` expects.
 *
 * The only thing it does is verify the schema is reachable. Real content
 * enters the system through real usage (signup → real collectibles → real
 * AI analysis) or, for MarketInsight, through a real ingestion job you
 * connect later (see README → "Market Insights ingestion").
 */
import { prisma } from "../src/lib/prisma";

async function main() {
  const userCount = await prisma.user.count();
  console.log(`Database reachable. Current user count: ${userCount}.`);
  console.log("No seed data inserted — this project does not use mock/sample data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
