import { Address } from "@graphprotocol/graph-ts";
import {
  AuctionCancelled,
  AuctionCreated,
  AuctionSuccessful,
} from "../../generated/AuctionHouse/AuctionHouse";
import {
  HeroAuction,
} from "../../generated/schema";
import {
  getOrCreateAccount,
  getOrCreateTransaction,
  getOrCreateHeroAuction,
} from "./common"

export function handleAuctionCancelled (
  event: AuctionCancelled,
): void {
  let auction = HeroAuction.load(event.params.auctionId.toString());
  auction.status = "Cancelled";
  auction.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    Address.fromString(auction.owner),
    "HeroAuctionCancelled",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.auction = auction.id;
  tx.save();
}

export function handleAuctionCreated(
  event: AuctionCreated,
): void {
  let auction = getOrCreateHeroAuction(
    event.params.auctionId,
    event.params.tokenId,
    event.params.owner,
  );
  let winnerAccount = getOrCreateAccount(event.params.winner.toHex());
  auction.status = "Selling";
  auction.startingPrice = event.params.startingPrice.toI32();
  auction.endingPrice = event.params.endingPrice.toI32();
  auction.duration = event.params.duration.toI32();
  auction.winner = winnerAccount.id;
  auction.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.owner,
    "HeroAuctionCreated",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.auction = auction.id;
  tx.save();
}

export function handleAuctionSuccessful(
  event: AuctionSuccessful
): void {
  let auction = HeroAuction.load(event.params.auctionId.toString());
  let winnerAccount = getOrCreateAccount(
    event.params.winner.toHex()
  )
  auction.status = "Sold";
  auction.totalPrice = event.params.totalPrice.toI32()
  auction.winner = winnerAccount.id;
  auction.save();

  let sellTx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    Address.fromString(auction.owner),
    "HeroAuctionSellSuccessful",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  sellTx.auction = auction.id;
  sellTx.save();

  let buyTx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    Address.fromString(auction.winner),
    "HeroAuctionBuySuccessful",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  buyTx.auction = auction.id;
  buyTx.save();
}
