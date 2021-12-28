
import { Address } from "@graphprotocol/graph-ts";

let BANK_CONTRACT_ADDRESS = "0xa9ce83507d872c5e1273e745abcfda849daa654f";
let GOLD_CONTRACT_ADDRESS = "0x3a4edcf3312f44ef027acfd8c21382a5259936e7";

let QUEST_TYPE_ADDRESS_MAPPING = new Map<string, string>()
QUEST_TYPE_ADDRESS_MAPPING.set("0x3132c76acf2217646fb8391918d28a16bd8a8ef4","Forager");
QUEST_TYPE_ADDRESS_MAPPING.set("0xe259e8386d38467f0e7ffedb69c3c9c935dfaefc", "Fisher");
QUEST_TYPE_ADDRESS_MAPPING.set("0xf5ff69f4ac4a851730668b93fc408bc1c49ef4ce","WishingWell");

let QUEST_STATUS_MAPPING = new Map<i32, string>()
QUEST_STATUS_MAPPING.set(1, "Started");
QUEST_STATUS_MAPPING.set(2, "Completed");
QUEST_STATUS_MAPPING.set(3, "Cancelled");

let HERO_STAT_MAPPING = new Map<i32, string>()
HERO_STAT_MAPPING.set(0, "Strength");
HERO_STAT_MAPPING.set(1, "Agility");
HERO_STAT_MAPPING.set(2, "Intelligence");
HERO_STAT_MAPPING.set(3, "Wisdom");
HERO_STAT_MAPPING.set(4, "Luck");
HERO_STAT_MAPPING.set(5, "Vitality");
HERO_STAT_MAPPING.set(6, "Endurance");
HERO_STAT_MAPPING.set(7, "Dexterity");

export function getQuestTypeFromAddress(address: string): string {
  return QUEST_TYPE_ADDRESS_MAPPING.has(address) ?
    QUEST_TYPE_ADDRESS_MAPPING.get(address) :
    "Undefined";
};

export function getQuestStatus(status: i32): string {
  return QUEST_STATUS_MAPPING.has(status) ?
    QUEST_STATUS_MAPPING.get(status) :
    "Undefined";
};

export function getHeroStat(stat: i32): string {
  return HERO_STAT_MAPPING.has(stat) ?
    HERO_STAT_MAPPING.get(stat) :
    "Undefined";
}

export function isBankAddress(address: Address): bool {
  return address.toHex() == BANK_CONTRACT_ADDRESS;
}

export function isGoldAddress(address: Address): bool {
  return address.toHex() == GOLD_CONTRACT_ADDRESS;
}
