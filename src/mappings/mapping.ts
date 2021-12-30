
import { Address } from "@graphprotocol/graph-ts";

export let JEWEL_CONTRACT_ADDRESS = "0x72cb10c6bfa5624dd07ef608027e366bd690048f";
export let JEWEL_ONE_LP_TOKEN_ADDRESS = "0xeb579ddcd49a7beb3f205c9ff6006bb6390f138f";
export let JEWEL_USDC_LP_TOKEN_ADDRESS = "0xa1221a5bbea699f507cc00bdedea05b5d2e32eba";
export let UNISWAP_FACTORY_ADDRESS = "0x9014b937069918bd319f80e8b3bb4a2cf6faa5f7";
let QUEST_CONTRACT_ADDRESS = "0x5100bd31b822371108a0f63dcfb6594b9919eaf4";
let BANK_CONTRACT_ADDRESS = "0xa9ce83507d872c5e1273e745abcfda849daa654f";
let GOLD_CONTRACT_ADDRESS = "0x3a4edcf3312f44ef027acfd8c21382a5259936e7";

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

export function isQuestContract(address: Address): bool {
  return address.toHex() == QUEST_CONTRACT_ADDRESS;
}

export function isGovernanceToken(address: string): bool {
  return address == JEWEL_CONTRACT_ADDRESS;
}
