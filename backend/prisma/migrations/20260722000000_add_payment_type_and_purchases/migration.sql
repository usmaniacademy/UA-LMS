-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('monthly', 'one_time');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN "paymentType" "PaymentType" NOT NULL DEFAULT 'monthly';

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchases_stripeCheckoutSessionId_key" ON "purchases"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_studentId_courseId_key" ON "purchases"("studentId", "courseId");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
