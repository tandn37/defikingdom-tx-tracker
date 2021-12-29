import { BigInt } from "@graphprotocol/graph-ts";
import {
  Approval,
  Transfer
} from "../../generated/Jewel/ERC20";
import { TokenApproval } from "../../generated/schema";
import {
  isZeroAddress,
  getOrCreateTransaction,
  getOrCreateTokenTransfer,
  getOrCreateToken,
  getOrCreateAccount,
} from "./common";
import {
  isBankTransfer,
  handleBankTransfer,
} from "./bank";
import {
  isInternalTx
} from './common';

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
  if (isInternalTx(event.address, event.transaction.to)) {
    return;
  }
  let tokenTransfer = getOrCreateTokenTransfer(
    event.transaction.hash,
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

export function handleApprovalEvent(
  event: Approval
): void {
  if (isZeroAddress(event.params.owner) ||
    isZeroAddress(event.params.spender)) {
    return;
  }
  if (isInternalTx(event.address, event.transaction.to)) {
    return;
  }
  let tokenApproval = new TokenApproval(event.transaction.hash.toHex());
  tokenApproval.token = getOrCreateToken(event.address).id;
  tokenApproval.owner = getOrCreateAccount(event.params.owner.toHex()).id;
  tokenApproval.spender = getOrCreateAccount(event.params.owner.toHex()).id;
  tokenApproval.amount = event.params.value;
  tokenApproval.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.owner,
    "TokenApproved",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.tokenApproval = tokenApproval.id;
  tx.save();
}
