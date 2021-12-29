import { Address, BigInt } from "@graphprotocol/graph-ts";
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
  getAuctionId,
  isProfileCreated,
  isInternalTx,
} from "./common"

const AUCTION_TYPE: string = "HeroSale";

export function handleAuctionCancelled (
  event: AuctionCancelled,
): void {
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
      return;
    }

  let id = getAuctionId(event.params.auctionId, AUCTION_TYPE);
  let auction = HeroAuction.load(id);
  auction.status = "Cancelled";
  auction.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    Address.fromString(auction.owner),
    "HeroSaleCancelled",
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
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }

  let auction = getOrCreateHeroAuction(
    event.params.auctionId,
    event.params.tokenId,
    event.params.owner,
    AUCTION_TYPE,
  );
  let winnerAccount = getOrCreateAccount(event.params.winner.toHex());
  auction.status = "Selling";
  auction.startingPrice = event.params.startingPrice;
  auction.endingPrice = event.params.endingPrice;
  auction.duration = event.params.duration.toI32();
  auction.winner = winnerAccount.id;
  auction.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.owner,
    "HeroSaleCreated",
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
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  
  let id = getAuctionId(event.params.auctionId, AUCTION_TYPE);
  let auction = HeroAuction.load(id);
  let winnerAccount = getOrCreateAccount(
    event.params.winner.toHex()
  )
  auction.status = "Sold";
  auction.totalPrice = event.params.totalPrice
  auction.winner = winnerAccount.id;
  auction.save();

  let sellTx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    Address.fromString(auction.owner),
    "HeroSaleSellSuccessful",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  sellTx.auction = auction.id;
  sellTx.gasPrice = BigInt.fromI32(0);
  sellTx.gasUsed = BigInt.fromI32(0);
  sellTx.save();

  let buyTx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    Address.fromString(auction.winner),
    "HeroSaleBuySuccessful",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  buyTx.auction = auction.id;
  buyTx.save();
}
