import {
  ItemTraded,
  ItemAdded,
} from "../../generated/Vendor/Vendor";
import {
  Item as ItemTemplate,
} from "../../generated/templates";
import {
  ItemTrading,
} from "../../generated/schema";
import {
  getOrCreateTransaction,
  getOrCreateAccount,
  getOrCreateToken,
} from "./common"
import {
  isGoldAddress,
} from "./mapping";
import {
  Approval,
  Transfer,
} from "../../generated/Jewel/ERC20";
import {
  handleTransferEvent as handleTransfer,
  handleApprovalEvent as handleApprove,
} from "./erc20";
import { log } from "@graphprotocol/graph-ts";

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

export function handleItemAdded(
  event: ItemAdded
): void {
  log.info('Createing {}', [event.params.item.toHex()])
  ItemTemplate.create(event.params.item);
}

export function handleTransferEvent(
  event: Transfer
): void {
  handleTransfer(event);
}

export function handleApprovalEvent(
  event: Approval
): void {
  handleApprove(event);
}
