import { BigInt } from "@graphprotocol/graph-ts";
import {
  Transfer
} from "../../generated/Jewel/ERC20";
import { Transaction } from "../../generated/schema";
import {
  isZeroAddress,
  getOrCreateTransaction,
  getOrCreateTokenTransfer,
} from "./common";
import {
  isBankTransfer,
  handleBankTransfer,
} from "./bank";
import {
  isBankAddress,
} from "./mapping";

// use transfer function instead of event
export function handleTransferEvent(
  event: Transfer
): void {
  if (isZeroAddress(event.params.from) ||
    isZeroAddress(event.params.to)) {
      return;
    }
  if (isBankTransfer(event)) {
    handleBankTransfer(event);
    return;
  }
  return;
  let tokenTransfer = getOrCreateTokenTransfer(
    event.params.id,
    event.address,
    event.params.from,
    event.params.to,
    event.params.value,
  );
  
  let sentTx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.from,
    "TokenSent",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  sentTx.tokenTransfer = tokenTransfer.id;
  sentTx.save();

  let receivedTx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.from,
    "TokenReceived",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  receivedTx.tokenTransfer = tokenTransfer.id;
  receivedTx.gasPrice = BigInt.fromI32(0);
  receivedTx.gasUsed = BigInt.fromI32(0);
  receivedTx.save();
}
