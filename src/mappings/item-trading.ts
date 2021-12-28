import {
  ItemTraded,
} from "../../generated/Vendor/Vendor";
import {
  ItemTrading,
} from "../../generated/schema";
import {
  getOrCreateTransaction,
  getOrCreateTokenTransfer,
  getOrCreateAccount,
  getOrCreateToken,
} from "./common"
import {
  isGoldAddress,
} from "./mapping";

export function handleItemTraded(
  event: ItemTraded,
): void {
  let itemTrading = ItemTrading.load(event.transaction.hash.toHex());
  let player = getOrCreateAccount(event.params.player.toHex());
  let isBuyTx = isGoldAddress(event.params.soldItem);
  let item = getOrCreateToken(isBuyTx ? event.params.boughtItem : event.params.soldItem);
  if (!itemTrading) {
    itemTrading = new ItemTrading(event.transaction.hash.toHex());
    itemTrading.player = player.id;
    itemTrading.type = isBuyTx ? "Buy" : "Sell";
    itemTrading.token = item.id;
    itemTrading.quantity = isBuyTx ? event.params.boughtQty.toI32() : event.params.soldQty.toI32();
    itemTrading.gold = isBuyTx ? event.params.soldQty : event.params.boughtQty;
    itemTrading.save();
  }
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.player,
    isBuyTx ? "ItemBought" : "ItemSold",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.itemsTrading = itemTrading.id;
  tx.save();
}
