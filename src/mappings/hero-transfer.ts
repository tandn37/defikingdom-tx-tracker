import { BigInt } from "@graphprotocol/graph-ts";
import {
  Transfer
} from "../../generated/HeroTransfer/ERC721";
import { Transaction } from "../../generated/schema";
import {
  isZeroAddress,
  getOrCreateTransaction,
  getOrCreateHeroTransfer,
} from "./common"

export function handleTransferEvent(
  event: Transfer
): void {
  if (isZeroAddress(event.params.from.toHex()) ||
    isZeroAddress(event.params.to.toHex())) {
    return;
  }
  let heroTransfer = getOrCreateHeroTransfer(
    event.transaction.hash,
    event.params.from,
    event.params.to,
    event.params.tokenId,
  );

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

  let receivedTx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.from,
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
