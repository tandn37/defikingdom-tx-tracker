import {
  Deposit,
  Withdraw,
  SendGovernanceTokenReward,
} from "../../generated/MasterGardener/MasterGardener";
import { GardenInfo, Transaction } from "../../generated/schema";
import {
  getOrCreateTransaction,
  getOrCreateGardenInfo,
  getTransactionId,
  ZERO,
} from "./common"

export function handleDeposit(
  event: Deposit
): void {
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
