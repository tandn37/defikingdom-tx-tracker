import {
  Address,
  BigInt,
  Bytes,
  log,
} from "@graphprotocol/graph-ts";
import {
  Account,
  Crystal,
  Hero,
  Transaction,
  Item,
  QuestReward,
  Quest,
  HeroAuction,
  Meditation,
} from "../../generated/schema";
import {
  getItemName,
} from './mapping';

export function getOrCreateAccount(
  address: string,
): Account {
  let account = Account.load(address);

  if (!account) {
    account = new Account(address);
    account.save();
  }
  return account as Account;
}

export function getOrCreateHero(
  heroId: string,
): Hero {
  let hero = Hero.load(heroId);

  if (!hero) {
    hero = new Hero(heroId);
    hero.save();
  }
  return hero as Hero;
}

export function getOrCreateQuest(
  questId: BigInt,
  player: Address,
): Quest {
  let quest = Quest.load(questId.toString());
  let account = getOrCreateAccount(player.toHexString());
  if (!quest) {
    quest = new Quest(questId.toString());
    quest.type = "Undefined";
    quest.address = '';
    quest.heroes = [];
    quest.player = account.id;
    quest.status = "Undefined";
    quest.save();
  }
  return quest as Quest;
}

export function getOrCreateQuestReward(
  questId: BigInt,
  player: Address,
  heroId: BigInt,
  itemId: Address,
  itemQuantity: BigInt,
): QuestReward {
  let questRewardId = questId.toString() + "_" + heroId.toString() + "_" + itemId.toHex();
  let questReward = QuestReward.load(questRewardId);
  let account = getOrCreateAccount(player.toHex());
  let hero = getOrCreateHero(heroId.toString());
  let item = getOrCreateItem(itemId.toHex());
  if (!questReward) {
    questReward = new QuestReward(questRewardId);
    questReward.player = account.id;
    questReward.quest = questId.toString();
    questReward.hero = hero.id;
    questReward.item = item.id;
    questReward.itemQuantity = itemQuantity.toI32();
    questReward.save();
  }
  return questReward as QuestReward;
}

export function getOrCreateItem(
  address: string,
): Item {
  let item = Item.load(address);
  if (!item) {
    item = new Item(address);
    item.name = getItemName(address);
    item.save();
  }
  return item as Item;
}

export function getOrCreateTransaction(
  block: BigInt,
  txHash: Bytes,
  player: Address,
  type: string,
  value: BigInt,
  contractAddress: Address,
  gasPrice: BigInt,
  gasUsed: BigInt,
  timestamp: BigInt,
): Transaction {
  let tx = new Transaction(txHash.toHexString() + "_" + type);
  let account = getOrCreateAccount(player.toHex());
  tx.block = block.toI32();
  tx.hash = txHash.toHex();
  tx.player = account.id;
  tx.type = type;
  tx.value = value;
  tx.contractAddress = contractAddress;
  tx.gasPrice = gasPrice;
  tx.gasUsed = gasUsed;
  tx.timestamp = timestamp.toI32();
  tx.save();
  return tx as Transaction;
}

export function getAuctionId(
  auctionId: BigInt,
  type: string
): string {
  return auctionId.toString() + "_" + type;
}

export function getOrCreateHeroAuction(
  auctionId: BigInt,
  tokenId: BigInt,
  owner: Address,
  type: string,
): HeroAuction {
  let id = getAuctionId(auctionId, type);
  let auction = HeroAuction.load(id);
  let ownerAccount = getOrCreateAccount(owner.toHex());
  let hero = getOrCreateHero(tokenId.toString());
  if (!auction) {
    auction = new HeroAuction(id);
    auction.hero = hero.id;
    auction.owner = ownerAccount.id;
    auction.type = type;
    auction.save();
  } else {
    if (type == "HeroSale" || type == "HeroRental") {
      log.info("FOUND EXIST AUCTION {}", [auction.id])
    }
  }
  return auction as HeroAuction;
}

export function getOrCreateMeditation(
  meditationId: BigInt,
  player: Address,
  heroId: BigInt,
): Meditation {
  let meditation = Meditation.load(meditationId.toString());
  let playerAccount = getOrCreateAccount(player.toHex());
  let hero = getOrCreateHero(heroId.toString())
  if (!meditation) {
    meditation = new Meditation(meditationId.toString());
    meditation.hero = hero.id;
    meditation.player = playerAccount.id;
    meditation.save();
  }
  return meditation as Meditation;
}

export function getOrCreateCrystal(
  crystalId: BigInt
): Crystal {
  let crystal = Crystal.load(crystalId.toString());

  if (!crystal) {
    crystal = new Crystal(crystalId.toString());
    crystal.save();
  }
  return crystal as Crystal;
}

let ZERO_ADDR = "0x0000000000000000000000000000000000000000";

export function isZeroAddress(
  address: string,
): bool {
  return address == ZERO_ADDR;
}
