import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  CrystalOpen,
  AuctionCancelled,
  AuctionCreated,
  AuctionSuccessful,
  CrystalSummoned,
} from "../../generated/HeroSummoning/HeroSummoning";
import {
  HeroAuction,
} from "../../generated/schema";
import {
  getOrCreateAccount,
  getOrCreateTransaction,
  getOrCreateCrystal,
  getOrCreateHero,
  getOrCreateHeroAuction,
  getAuctionId,
  isInternalTx,
  isProfileCreated,
} from "./common"

const AUCTION_TYPE: string = "HeroRental";

export function handleCrystalOpen(
  event: CrystalOpen,
): void {
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  let crystal = getOrCreateCrystal(
    event.params.crystalId,
  );
  let player = getOrCreateAccount(event.params.owner.toHex());
  let hero = getOrCreateHero(event.params.heroId.toString());
  crystal.player = player.id;
  crystal.hero = hero.id;
  crystal.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.owner,
    "HeroCrystalOpen",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.crystal = crystal.id;
  tx.save();
}

export function handleAuctionCancelled(
  event: AuctionCancelled,
): void {
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  let id = getAuctionId(event.params.auctionId, AUCTION_TYPE);
  let auction = HeroAuction.load(id);
  if (!auction) {
    return;
  }
  auction.status = "Cancelled";
  auction.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    Address.fromString(auction.owner),
    "HeroRentalCancelled",
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
  auction.status = "Renting";
  auction.startingPrice = event.params.startingPrice;
  auction.endingPrice = event.params.endingPrice;
  auction.duration = event.params.duration.toI32();
  auction.winner = winnerAccount.id;
  auction.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.owner,
    "HeroRentalCreated",
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
  if (isInternalTx(event.address, event.transaction.to)) {
    return;
  }
  let id = getAuctionId(event.params.auctionId, AUCTION_TYPE);
  let auction = HeroAuction.load(id);
  let winnerAccount = getOrCreateAccount(
    event.params.winner.toHex()
  )
  auction.status = "Rent";
  auction.totalPrice = event.params.totalPrice
  auction.winner = winnerAccount.id;
  auction.save();

  if (isProfileCreated(Address.fromString(auction.owner))) {
    let rentOutTx = getOrCreateTransaction(
      event.block.number,
      event.transaction.hash,
      Address.fromString(auction.owner),
      "HeroRentOutSuccessful",
      event.transaction.value,
      event.address,
      event.transaction.gasPrice,
      event.transaction.gasUsed,
      event.block.timestamp,
    )
    rentOutTx.auction = auction.id;
    rentOutTx.save();
  }

  if (isProfileCreated(Address.fromString(auction.winner))) {
    let rentTx = getOrCreateTransaction(
      event.block.number,
      event.transaction.hash,
      Address.fromString(auction.winner),
      "HeroRentSuccessful",
      event.transaction.value,
      event.address,
      event.transaction.gasPrice,
      event.transaction.gasUsed,
      event.block.timestamp,
    )
    rentTx.auction = auction.id;
    rentTx.save();
  }
}

export function handleCrystalSummoned(
  event: CrystalSummoned
): void {
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  let crystal = getOrCreateCrystal(event.params.crystalId);
  let player = getOrCreateAccount(event.params.owner.toHex());
  let summoner = getOrCreateHero(event.params.summonerId.toString());
  let assistant = getOrCreateHero(event.params.assistantId.toString());
  crystal.player = player.id;
  crystal.summoner = summoner.id;
  crystal.assistant = assistant.id;
  crystal.generation = event.params.generation;
  crystal.createdBlock = event.params.createdBlock.toI32();
  crystal.summonerTears = event.params.summonerTears;
  crystal.assistantTears = event.params.assistantTears;
  crystal.bonusItem = event.params.bonusItem.toHex();
  crystal.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.owner,
    "HeroCrystalSummoned",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.crystal = crystal.id;
  tx.save();
}
