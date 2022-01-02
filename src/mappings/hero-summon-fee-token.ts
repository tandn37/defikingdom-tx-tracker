import { BigInt } from "@graphprotocol/graph-ts";
import {
  Approval,
  Transfer
} from "../../generated/Jewel/ERC20";
import { TokenApproval } from "../../generated/schema";
import {
  isZeroAddress,
} from "./common";
import { isQuestContract } from "./mapping";
import {
  handleApprovalEvent as handleApproval,
  createTransferTx,
} from "./erc20";
import {
  isRouterContract,
} from "./mapping";

export function handleTransferEvent(
  event: Transfer
): void {
  if (isZeroAddress(event.params.from)) {
    return;
  }
  if (isQuestContract(event.address)) {
    return;
  }
  if (isRouterContract(event.address)) {
    return;
  }
  createTransferTx(event);
}

export function handleApprovalEvent(
  event: Approval
): void {
  handleApproval(event);
}
