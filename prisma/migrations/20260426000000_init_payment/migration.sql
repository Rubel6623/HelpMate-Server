-- Re-creating the payment and task status migration
-- Note: This migration was manually applied to fix drift without data loss.

-- 1. Handle PaymentStatus Enum
-- If PaymentStatus already has the new variants, this might be a no-op or handled via shadow db.
BEGIN;
-- We use a check to see if we need to create it (Shadow DB check)
-- But Prisma migrations are usually linear. In Shadow DB, this will run from scratch.
CREATE TYPE "PaymentStatus_new" AS ENUM ('AUTHORIZED', 'ESCROW', 'RELEASED', 'REFUNDED', 'FAILED');
ALTER TABLE "task_payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "task_payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING (
  CASE "status"::text
    WHEN 'PENDING' THEN 'AUTHORIZED'::"PaymentStatus_new"
    WHEN 'ESCROWED' THEN 'ESCROW'::"PaymentStatus_new"
    ELSE "status"::text::"PaymentStatus_new"
  END
);
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "task_payments" ALTER COLUMN "status" SET DEFAULT 'AUTHORIZED';
COMMIT;

-- 2. Handle TaskStatus Enum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'RELEASED', 'CANCELLED', 'DISPUTED');
ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "TaskStatus_new" USING (
  CASE "status"::text
    WHEN 'OPEN' THEN 'PENDING'::"TaskStatus_new"
    WHEN 'ASSIGNED' THEN 'ACCEPTED'::"TaskStatus_new"
    WHEN 'CONFIRMED' THEN 'RELEASED'::"TaskStatus_new"
    ELSE "status"::text::"TaskStatus_new"
  END
);
ALTER TABLE "task_status_logs" ALTER COLUMN "status" TYPE "TaskStatus_new" USING (
  CASE "status"::text
    WHEN 'OPEN' THEN 'PENDING'::"TaskStatus_new"
    WHEN 'ASSIGNED' THEN 'ACCEPTED'::"TaskStatus_new"
    WHEN 'CONFIRMED' THEN 'RELEASED'::"TaskStatus_new"
    ELSE "status"::text::"TaskStatus_new"
  END
);
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- 3. AlterTable
ALTER TABLE "task_payments" ADD COLUMN "paymentIntentId" TEXT;

-- 4. CreateTable
CREATE TABLE "transfers" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- 5. CreateIndex
CREATE UNIQUE INDEX "transfers_paymentId_key" ON "transfers"("paymentId");

-- 6. AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "task_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
