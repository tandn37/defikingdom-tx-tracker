import { BigInt } from "@graphprotocol/graph-ts";
import {
  Transfer,
  Approval,
  ApprovalForAll,
} from "../../generated/HeroTransfer/ERC721";
import { HeroApproval } from "../../generated/schema";
import {
  isZeroAddress,
  getOrCreateTransaction,
  getOrCreateHeroTransfer,
  isInternalTx,
  isProfileCreated,
  getOrCreateAccount,
} from "./common"

export function handleApprovalEvent(
  event: Approval,
): void {
  if (isZeroAddress(event.params.approved)) {
    return;
  }
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  if (event.transaction.from.toHex() != event.params.owner.toHex()) {
    return;
  }
  let heroApproval = new HeroApproval(event.transaction.hash.toHex());
  heroApproval.token = event.address.toHex()
  heroApproval.owner = getOrCreateAccount(event.params.owner.toHex()).id;
  heroApproval.spender = getOrCreateAccount(event.params.approved.toHex()).id;
  heroApproval.tokenId = event.params.tokenId;
  heroApproval.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.transaction.from,
    "NFTTokenApproved",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.heroApproval = heroApproval.id;
  tx.save();
}

export function handleApprovalForAll(
  event: ApprovalForAll,
): void {
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  if (event.transaction.from.toHex() != event.params.owner.toHex()) {
    return;
  }
  let heroApproval = new HeroApproval(event.transaction.hash.toHex());
  heroApproval.token = event.address.toHex()
  heroApproval.owner = getOrCreateAccount(event.params.owner.toHex()).id;
  heroApproval.spender = getOrCreateAccount(event.params.operator.toHex()).id;
  heroApproval.approvedAll = event.params.approved;
  heroApproval.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.transaction.from,
    "NFTTokenApproved",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.heroApproval = heroApproval.id;
  tx.save();
}

export function handleTransferEvent(
  event: Transfer
): void {
  if (isZeroAddress(event.params.from) ||
    isZeroAddress(event.params.to)) {
    return;
  }
  if (isInternalTx(event.address, event.transaction.to)) {
    return;
  }
  let heroTransfer = getOrCreateHeroTransfer(
    event.transaction.hash,
    event.params.from,
    event.params.to,
    event.params.tokenId,
  );

  if (isProfileCreated(event.params.from)) {
    let sentTx = getOrCreateTransaction(
      event.block.number,
      event.transaction.hash,
      event.params.from,
      "HeroSent",
      event.transaction.value,
      event.address,
      event.transaction.gasPrice,
      event.transaction.gasUsed,
      event.block.timestamp,
    )
    sentTx.heroTransfer = heroTransfer.id;
    sentTx.save();
  }

  if (isProfileCreated(event.params.to)) {
    let receivedTx = getOrCreateTransaction(
      event.block.number,
      event.transaction.hash,
      event.params.to,
      "HeroReceived",
      event.transaction.value,
      event.address,
      event.transaction.gasPrice,
      event.transaction.gasUsed,
      event.block.timestamp,
    )
    receivedTx.heroTransfer = heroTransfer.id;
    receivedTx.gasPrice = BigInt.fromI32(0);
    receivedTx.gasUsed = BigInt.fromI32(0);
    receivedTx.save();
  }
}
