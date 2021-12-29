import {
  ERC20,
} from "../../generated/Jewel/ERC20";
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
  QuestReward,
  Quest,
  HeroAuction,
  Meditation,
  Token,
  TokenTransfer,
  HeroTransfer,
  Pair,
  PairChange,
  GardenInfo,
} from "../../generated/schema";

export let ZERO = BigInt.fromI32(0);

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

export function getOrCreateToken(
  address: Address,
): Token {
  let token = Token.load(address.toHex());

  if (!token) {
    token = new Token(address.toHex());
    let tokenContract = ERC20.bind(address);
    token.name = tokenContract.name();
    token.symbol = tokenContract.symbol();
    token.decimal = tokenContract.decimals();
    token.save();
  }
  return token as Token;
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
  let item = getOrCreateToken(itemId);
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

export function getTransactionId(
  hash: Bytes,
  type: string,
): string {
  return hash.toHex() + "_" + type;
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
  let tx = new Transaction(getTransactionId(txHash, type));
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

export function getOrCreateTokenTransfer(
  id: Bytes,
  tokenAddress: Address,
  from: Address,
  to: Address,
  value: BigInt,
): TokenTransfer {
  let tokenTransfer = TokenTransfer.load(id.toHex());
  let token = getOrCreateToken(tokenAddress);
  let fromAccount = getOrCreateAccount(from.toHex());
  let toAccount = getOrCreateAccount(to.toHex());
  if (!tokenTransfer) {
    tokenTransfer = new TokenTransfer(id.toHex());
    tokenTransfer.token = token.id;
    tokenTransfer.from = fromAccount.id;
    tokenTransfer.to = toAccount.id;
    tokenTransfer.value = value;
    tokenTransfer.save();
  }
  return tokenTransfer as TokenTransfer;
}

export function getOrCreateHeroTransfer(
  hash: Bytes,
  from: Address,
  to: Address,
  heroId: BigInt,
): HeroTransfer {
  let heroTransfer = HeroTransfer.load(hash.toHex());
  let fromAccount = getOrCreateAccount(from.toHex());
  let toAccount = getOrCreateAccount(to.toHex());
  let hero = getOrCreateHero(heroId.toString());
  if (!heroTransfer) {
    heroTransfer = new HeroTransfer(hash.toHex());
    heroTransfer.from = fromAccount.id;
    heroTransfer.to = toAccount.id;
    heroTransfer.hero = hero.id;
    heroTransfer.save();
  }
  return heroTransfer as HeroTransfer;
}

export function getOrCreatePair(
  address: Address,
): Pair {
  let pair = Pair.load(address.toHex());
  if (!pair) {
    pair = new Pair(address.toHex());
    pair.save();
  }

  return pair as Pair;
}

export function getOrCreatePairChange(
  hash: Bytes,
  pairAddress: Address,
  sender: Address,
  type: string,
): PairChange {
  let pairChange = PairChange.load(hash.toHex());
  let pair = getOrCreatePair(pairAddress);
  let senderAccount = getOrCreateAccount(sender.toHex());
  if (!pairChange) {
    pairChange = new PairChange(hash.toHex());
    pairChange.pair = pair.id;
    pairChange.sender = senderAccount.id;
    pairChange.type = type;
    pairChange.save();
  }

  return pairChange as PairChange;
}

export function getOrCreateGardenInfo(
  hash: Bytes,
  player: Address,
  poolId: BigInt,
  amount: BigInt,
  type: string,
): GardenInfo {
  let id = hash.toHex() + "_" + type;
  let gardenInfo = GardenInfo.load(id);
  let playerAccount = getOrCreateAccount(player.toHex());
  if (!gardenInfo) {
    gardenInfo = new GardenInfo(id);
    gardenInfo.player = playerAccount.id;
    gardenInfo.poolId = poolId;
    gardenInfo.amount = amount;
    gardenInfo.type = type;
    gardenInfo.save();
  }

  return gardenInfo as GardenInfo;
}

let ZERO_ADDR = "0x0000000000000000000000000000000000000000";

export function isZeroAddress(
  address: Address,
): bool {
  return address.toHex() == ZERO_ADDR;
}

export function isInternalTx(
  contractEmittedEvent: Address,
  toContractAddress: Address | null,
): bool {
  if (!toContractAddress) {
    return false;
  }
  return contractEmittedEvent.toHex() != toContractAddress.toHex();
}
