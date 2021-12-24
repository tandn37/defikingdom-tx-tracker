import {
  EnterCall,
  LeaveCall
} from "../../generated/Bank/Bank";
import {
  getOrCreateTransaction,
  getOrCreateTokenTransfer,
} from "./common"
import {
  
} from "./mapping";

export function handleEnter(
  call: EnterCall
): void {
  let tokenTransfer = getOrCreateTokenTransfer(
    call.transaction.hash,
    call.to,
    call.from,
    call.to,
    call.inputs._amount,
  )
  let tx = getOrCreateTransaction(
    call.block.number,
    call.transaction.hash,
    call.from,
    "BankDeposited",
    call.transaction.value,
    call.to,
    call.transaction.gasPrice,
    call.transaction.gasUsed,
    call.block.timestamp,
  )
  tx.tokenTransfer = tokenTransfer.id;
  tx.save();
}

export function handleLeave(
  call: LeaveCall
): void {
  let tx = getOrCreateTransaction(
    call.block.number,
    call.transaction.hash,
    call.from,
    "BankWithdrawn",
    call.transaction.value,
    call.to,
    call.transaction.gasPrice,
    call.transaction.gasUsed,
    call.block.timestamp,
  )
  tx.save();
}
