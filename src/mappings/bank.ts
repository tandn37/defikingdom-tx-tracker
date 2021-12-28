import { log } from "@graphprotocol/graph-ts";
import {
  Transfer
} from "../../generated/Jewel/ERC20";
import {
  getOrCreateTransaction,
  getOrCreateTokenTransfer,
} from "./common"
import {
  isBankAddress,
} from "./mapping";

export function handleDepositTx(
  event: Transfer
): void {
  let tokenTransfer = getOrCreateTokenTransfer(
    event.transaction.hash,
    event.address,
    event.params.from,
    event.params.to,
    event.params.value,
  )
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.from,
    "BankDeposited",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.tokenTransfer = tokenTransfer.id;
  tx.save();
}

export function handleWithdrawTx(
  event: Transfer
): void {
  let tokenTransfer = getOrCreateTokenTransfer(
    event.transaction.hash,
    event.address,
    event.params.from,
    event.params.to,
    event.params.value,
  )
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.to,
    "BankWithdrawn",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.tokenTransfer = tokenTransfer.id;
  tx.save();
}

export function isBankTransfer(
  event: Transfer
): bool {
  log.info('FROM {} TO {}', [event.params.from.toHex(), event.params.to.toHex()]);
  return isBankAddress(event.params.from) || isBankAddress(event.params.to);
}

export function handleBankTransfer(
  event: Transfer
): void {
  if (isBankAddress(event.params.from)) {
    handleWithdrawTx(event);
  } else if (isBankAddress(event.params.to)) {
    handleDepositTx(event);
  }
}
