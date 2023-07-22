-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "name" TEXT NOT NULL,
    "role" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "transactionType" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "product" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "sellerType" INTEGER NOT NULL,
    "sellerName" TEXT,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_name_key" ON "Seller"("name");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_sellerName_fkey" FOREIGN KEY ("sellerName") REFERENCES "Seller"("name") ON DELETE SET NULL ON UPDATE CASCADE;
