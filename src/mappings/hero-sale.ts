import {
  CrystalOpen,
  Gen0Purchase,
} from "../../generated/HeroSale/HeroSale";
import {
  HeroSale,
} from "../../generated/schema";
import {
  getOrCreateAccount,
  getOrCreateTransaction,
  getOrCreateCrystal,
  getOrCreateHero,
  isInternalTx,
  isProfileCreated,
} from "./common"

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

export function handleGen0Purchase(
  event: Gen0Purchase,
): void {
  if (isInternalTx(event.address, event.transaction.to) ||
    !isProfileCreated(event.transaction.from)) {
    return;
  }
  let heroSale = HeroSale.load(event.transaction.hash.toHex());
  let player = getOrCreateAccount(event.params.owner.toHex());
  let crystal = getOrCreateCrystal(event.params.crystalId);
  if (!heroSale) {
    heroSale = new HeroSale(event.transaction.hash.toHex());
    heroSale.player = player.id;
    heroSale.crystal = crystal.id;
    heroSale.createdBlock = event.params.createdBlock.toI32();
    heroSale.purchasePrice = event.params.purchasePrice;
    heroSale.save();
  }
  
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.owner,
    "HeroGen0Purchase",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.meditation = heroSale.id;
  tx.save();
}
