
import { Address, log } from "@graphprotocol/graph-ts";

let TOKEN_ADDRESS_MAPPING = new Map<string, string>()
TOKEN_ADDRESS_MAPPING.set("0x72Cb10C6bfA5624dD07Ef608027E366bd690048F", "Jewel");
TOKEN_ADDRESS_MAPPING.set("0x3a4edcf3312f44ef027acfd8c21382a5259936e7", "DFKGold");
TOKEN_ADDRESS_MAPPING.set("0xA9cE83507D872C5e1273E745aBcfDa849DAA654F", "Bank");

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

let ITEM_NAME_MAPPING = new Map<string, string>()
ITEM_NAME_MAPPING.set("0x24ea0d436d3c2602fbfefbe6a16bbc304c963d04", "GaiaTears");
ITEM_NAME_MAPPING.set("0x6e1bc01cc52d165b357c42042cf608159a2b81c1", "Ambertaffy");
ITEM_NAME_MAPPING.set("0x68ea4640c5ce6cc0c9a1f17b7b882cb1cbeaccd7", "Darkweed");
ITEM_NAME_MAPPING.set("0x600541ad6ce0a8b5dae68f086d46361534d20e80", "Goldvein");
ITEM_NAME_MAPPING.set("0x043f9bd9bb17dfc90de3d416422695dd8fa44486", "Ragweed");
ITEM_NAME_MAPPING.set("0x094243dfabfbb3e6f71814618ace53f07362a84c", "Redleaf");
ITEM_NAME_MAPPING.set("0x6b10ad6e3b99090de20bf9f95f960addc35ef3e2", "Rockroot");
ITEM_NAME_MAPPING.set("0xcdffe898e687e941b124dfb7d24983266492ef1d", "SwiftThistle");
ITEM_NAME_MAPPING.set("0x78aed65a2cc40c7d8b0df1554da60b38ad351432", "Bloater");
ITEM_NAME_MAPPING.set("0xe4cfee5bf05cef3418da74cfb89727d8e4fee9fa", "Ironscale");
ITEM_NAME_MAPPING.set("0x8bf4a0888451c6b5412bcad3d9da3dcf5c6ca7be", "Lanterneye");
ITEM_NAME_MAPPING.set("0xc5891912718ccffcc9732d1942ccd98d5934c2e1", "Redgill");
ITEM_NAME_MAPPING.set("0xb80a07e13240c31ec6dc0b5d72af79d461da3a70", "Sailfish");
ITEM_NAME_MAPPING.set("0x372caf681353758f985597a35266f7b330a2a44d", "Shimmerskin");
ITEM_NAME_MAPPING.set("0x2493cfdacc0f9c07240b5b1c4be08c62b8eeff69", "Silverfin");
ITEM_NAME_MAPPING.set("0x66f5bfd910cd83d3766c4b39d13730c911b2d286", "ShvasRune");
ITEM_NAME_MAPPING.set("0x9678518e04fe02fb30b55e2d0e554e26306d0892", "BluePetEgg");
ITEM_NAME_MAPPING.set("0x95d02c1dc58f05a015275eb49e107137d9ee81dc", "GreyPetEgg");
ITEM_NAME_MAPPING.set("0x9edb3da18be4b03857f3d39f83e5c6aa", "GoldenEgg");

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

export function getItemName(address: string): string {
  return ITEM_NAME_MAPPING.has(address) ?
    ITEM_NAME_MAPPING.get(address) :
    "Undefined";
}

export function getHeroStat(stat: i32): string {
  return HERO_STAT_MAPPING.has(stat) ?
    HERO_STAT_MAPPING.get(stat) :
    "Undefined";
}

export function getTokenSymbol(address: Address): string {
  return TOKEN_ADDRESS_MAPPING.has(address.toString()) ?
    TOKEN_ADDRESS_MAPPING.get(address.toString()) :
    "Undefined";
}

export function getTokenDecimal(address: Address): i32 {
  let tokenSymbol = getTokenSymbol(address);
  if (tokenSymbol == "Jewel") {
    return 18;
  } else if (tokenSymbol == "DFKGold") {
    return 3;
  } else {
    return 0;
  }
}
