/*
  Warnings:

  - A unique constraint covering the columns `[parkingLotId,spaceNumber]` on the table `parking_spaces` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_idx" ON "audit_logs"("entityType");

-- CreateIndex
CREATE INDEX "audit_logs_entityId_idx" ON "audit_logs"("entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "companies_companyType_idx" ON "companies"("companyType");

-- CreateIndex
CREATE INDEX "companies_isActive_idx" ON "companies"("isActive");

-- CreateIndex
CREATE INDEX "companies_companyType_isActive_idx" ON "companies"("companyType", "isActive");

-- CreateIndex
CREATE INDEX "drivers_companyId_idx" ON "drivers"("companyId");

-- CreateIndex
CREATE INDEX "drivers_isActive_idx" ON "drivers"("isActive");

-- CreateIndex
CREATE INDEX "drivers_companyId_isActive_idx" ON "drivers"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "parking_lots_companyId_idx" ON "parking_lots"("companyId");

-- CreateIndex
CREATE INDEX "parking_lots_isActive_idx" ON "parking_lots"("isActive");

-- CreateIndex
CREATE INDEX "parking_lots_companyId_isActive_idx" ON "parking_lots"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "parking_lots_latitude_longitude_idx" ON "parking_lots"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "parking_spaces_parkingLotId_idx" ON "parking_spaces"("parkingLotId");

-- CreateIndex
CREATE INDEX "parking_spaces_isAvailable_idx" ON "parking_spaces"("isAvailable");

-- CreateIndex
CREATE INDEX "parking_spaces_isActive_idx" ON "parking_spaces"("isActive");

-- CreateIndex
CREATE INDEX "parking_spaces_parkingLotId_isAvailable_idx" ON "parking_spaces"("parkingLotId", "isAvailable");

-- CreateIndex
CREATE INDEX "parking_spaces_parkingLotId_spaceType_idx" ON "parking_spaces"("parkingLotId", "spaceType");

-- CreateIndex
CREATE UNIQUE INDEX "parking_spaces_parkingLotId_spaceNumber_key" ON "parking_spaces"("parkingLotId", "spaceNumber");

-- CreateIndex
CREATE INDEX "reservations_parkingLotId_idx" ON "reservations"("parkingLotId");

-- CreateIndex
CREATE INDEX "reservations_parkingSpaceId_idx" ON "reservations"("parkingSpaceId");

-- CreateIndex
CREATE INDEX "reservations_companyId_idx" ON "reservations"("companyId");

-- CreateIndex
CREATE INDEX "reservations_vehicleId_idx" ON "reservations"("vehicleId");

-- CreateIndex
CREATE INDEX "reservations_driverId_idx" ON "reservations"("driverId");

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "reservations"("status");

-- CreateIndex
CREATE INDEX "reservations_paymentStatus_idx" ON "reservations"("paymentStatus");

-- CreateIndex
CREATE INDEX "reservations_startTime_idx" ON "reservations"("startTime");

-- CreateIndex
CREATE INDEX "reservations_endTime_idx" ON "reservations"("endTime");

-- CreateIndex
CREATE INDEX "reservations_createdAt_idx" ON "reservations"("createdAt");

-- CreateIndex
CREATE INDEX "reservations_parkingLotId_status_idx" ON "reservations"("parkingLotId", "status");

-- CreateIndex
CREATE INDEX "reservations_companyId_status_idx" ON "reservations"("companyId", "status");

-- CreateIndex
CREATE INDEX "reservations_startTime_endTime_idx" ON "reservations"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "reservations_parkingLotId_startTime_endTime_idx" ON "reservations"("parkingLotId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "transactions_reservationId_idx" ON "transactions"("reservationId");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_transactionType_idx" ON "transactions"("transactionType");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- CreateIndex
CREATE INDEX "transactions_processedAt_idx" ON "transactions"("processedAt");

-- CreateIndex
CREATE INDEX "transactions_externalTransactionId_idx" ON "transactions"("externalTransactionId");

-- CreateIndex
CREATE INDEX "users_companyId_idx" ON "users"("companyId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE INDEX "users_companyId_role_idx" ON "users"("companyId", "role");

-- CreateIndex
CREATE INDEX "users_companyId_isActive_idx" ON "users"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "vehicles_companyId_idx" ON "vehicles"("companyId");

-- CreateIndex
CREATE INDEX "vehicles_driverId_idx" ON "vehicles"("driverId");

-- CreateIndex
CREATE INDEX "vehicles_vehicleType_idx" ON "vehicles"("vehicleType");

-- CreateIndex
CREATE INDEX "vehicles_isActive_idx" ON "vehicles"("isActive");

-- CreateIndex
CREATE INDEX "vehicles_companyId_isActive_idx" ON "vehicles"("companyId", "isActive");

-- CreateIndex
CREATE INDEX "vehicles_companyId_vehicleType_idx" ON "vehicles"("companyId", "vehicleType");
