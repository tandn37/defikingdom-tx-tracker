import {
  Deposit,
  Withdraw,
  SendGovernanceTokenReward,
} from "../../generated/MasterGardener/MasterGardener";
import { Transaction } from "../../generated/schema";
import {
  getOrCreateTransaction,
  getOrCreateGardenInfo,
  getTransactionId,
  isInternalTx,
  isProfileCreated,
  ZERO,
} from "./common"

export function handleDeposit(
  event: Deposit
): void {
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  let gardenInfo = getOrCreateGardenInfo(
    event.transaction.hash,
    event.params.user,
    event.params.pid,
    event.params.amount,
    "Deposit",
  )
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.user,
    "GardenDeposited",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.gardenInfo = gardenInfo.id;
  tx.save();

  let harvestTx = Transaction.load(getTransactionId(event.transaction.hash, "GardenHarvested"));
  if (harvestTx) {
    harvestTx.gasPrice = ZERO;
    harvestTx.gasUsed = ZERO;
    harvestTx.save();
  }
}

export function handleWithdraw(
  event: Withdraw
): void {
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  let gardenInfo = getOrCreateGardenInfo(
    event.transaction.hash,
    event.params.user,
    event.params.pid,
    event.params.amount,
    "Withdraw",
  )
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.user,
    "GardenWithdrawn",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.gardenInfo = gardenInfo.id;
  tx.save();
}

export function handleReward(
  event: SendGovernanceTokenReward
): void {
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  let gardenInfo = getOrCreateGardenInfo(
    event.transaction.hash,
    event.params.user,
    event.params.pid,
    event.params.amount,
    "Harvest",
  )
  gardenInfo.lockAmount = event.params.lockAmount;
  gardenInfo.save();
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.user,
    "GardenHarvested",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.gardenInfo = gardenInfo.id;
  tx.save();
}
