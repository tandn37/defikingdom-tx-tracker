import { log } from "@graphprotocol/graph-ts"
import {
    Transfer
} from "../../generated/Jewel/Jewel";
import { Transaction } from "../../generated/schema";
import {
    getOrCreateAccount,
} from "./common"

export function handleTransferEvent(
    event: Transfer
): void {
    let txHash = event.transaction.hash.toHexString();
    let senderTx = new Transaction(txHash + "_" + event.params.from.toHexString());
    let senderAccount = getOrCreateAccount(event.params.from.toHexString());
    let receiveAccount = getOrCreateAccount(event.params.to.toHexString());
    senderTx.type = "TokenSend";
    senderTx.block = event.block.number.toString();
    senderTx.txHash = txHash;
    senderTx.account = senderAccount.id;
    senderTx.relatedAccount = receiveAccount.id;
    senderTx.amount = event.params.value;
    senderTx.contract = event.address;
    senderTx.gasPrice = event.transaction.gasPrice;
    senderTx.gasUsed = event.transaction.gasUsed;
    senderTx.timestamp = event.block.timestamp.toI32();
    senderTx.save();

    let receiverTx = new Transaction(txHash + "_" + event.params.to.toHexString())
    receiverTx.type = "TokenReceive";
    receiverTx.block = event.block.number.toString();
    receiverTx.txHash = txHash;
    receiverTx.account = receiveAccount.id;
    receiverTx.relatedAccount = senderAccount.id;
    receiverTx.amount = event.params.value;
    receiverTx.contract = event.address;
    receiverTx.gasPrice = event.transaction.gasPrice;
    receiverTx.gasUsed = event.transaction.gasUsed;
    receiverTx.timestamp = event.block.timestamp.toI32();
    receiverTx.save();
}
