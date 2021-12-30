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
  isProfileCreated,
  ZERO,
} from "./common";
import {
  isBankTransfer,
  handleBankTransfer,
} from "./bank";
import {
  isInternalTx
} from "./common";
import {
  handleApprovalEvent as handleApproval,
  createTransferTx,
} from "./erc20";

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
  createTransferTx(event);
}

export function handleApprovalEvent(
  event: Approval
): void {
  handleApproval(event);
}
