import {
  PairCreated,
} from "../../generated/Dex/UniswapV2Factory";
import {
  Pair as PairTemplate,
} from "../../generated/templates";
import {
  Burn,
  Mint,
  Swap,
  Sync,
} from "../../generated/JewelLP/UniswapV2LPToken";
import {
  Approval,
  Transfer,
} from "../../generated/Jewel/ERC20";

import {
  getOrCreatePair,
  getOrCreatePairChange,
  getOrCreateToken,
  getOrCreateTransaction,
  isProfileCreated,
  ZERO,
} from "./common";
import {
  handleTransferEvent as handleTransfer,
  handleApprovalEvent as handleApprove,
} from "./erc20";

export function handlePairCreated(
  event: PairCreated
): void {
  let pair = getOrCreatePair(
    event.params.pair,
  )
  pair.token0 = getOrCreateToken(event.params.token0).id;
  pair.token1 = getOrCreateToken(event.params.token1).id;
  PairTemplate.create(event.params.pair)
  pair.save();
}

export function handleBurn(
  event: Burn
): void {
  if (!isProfileCreated(event.params.to)) {
    return;
  }
  let pairChange = getOrCreatePairChange(
    event.transaction.hash,
    event.address,
    event.params.sender,
    "Burn",
  );
  pairChange.amount0 = event.params.amount0;
  pairChange.amount1 = event.params.amount1;
  pairChange.save();
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.to,
    "LiquidityRemoved",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  if (event.params.to.toHex() != event.params.sender.toHex()) {
    tx.gasPrice = ZERO;
    tx.gasUsed = ZERO;
  }
  tx.pairChange = pairChange.id;
  tx.save();
}

export function handleMint(
  event: Mint
): void {
  if (!isProfileCreated(event.params.sender)) {
    return;
  }
  let pairChange = getOrCreatePairChange(
    event.transaction.hash,
    event.address,
    event.params.sender,
    "Mint",
  );
  pairChange.amount0 = event.params.amount0;
  pairChange.amount1 = event.params.amount1;
  pairChange.save();
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.sender,
    "LiquidityAdded",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.pairChange = pairChange.id;
  tx.save();
}

export function handleSwap(
  event: Swap
): void {
  if (!isProfileCreated(event.params.sender)) {
    return;
  }
  let pairChange = getOrCreatePairChange(
    event.transaction.hash,
    event.address,
    event.params.sender,
    "Swap",
  );
  pairChange.amount0In = event.params.amount0In;
  pairChange.amount1In = event.params.amount1In;
  pairChange.amount0Out = event.params.amount0Out;
  pairChange.amount0Out = event.params.amount0Out;
  pairChange.save();
  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.to,
    "TokenSwapped",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  if (event.params.to.toHex() != event.params.sender.toHex()) {
    tx.gasPrice = ZERO;
    tx.gasUsed = ZERO;
  }
  tx.pairChange = pairChange.id;
  tx.save();
}

export function handleSync(
  event: Sync
): void {
  let pair = getOrCreatePair(event.address);
  pair.reserve0 = event.params.reserve0;
  pair.reserve1 = event.params.reserve1;
  pair.save();
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