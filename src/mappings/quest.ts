import {
  QuestCanceled,
  QuestCompleted,
  QuestStarted,
  QuestReward,
} from "../../generated/Quest/Quest";
import {
  getOrCreateQuest,
  getOrCreateQuestReward,
  isZeroAddress,
  getOrCreateTransaction,
} from "./common"
import {
  getQuestTypeFromAddress,
  getQuestStatus,
} from "./mapping"

export function handleQuestCanceled(
  event: QuestCanceled,
): void {
  let quest = getOrCreateQuest(event.params.questId, event.params.player);
  quest.status = getQuestStatus(event.params.quest.status);
  quest.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.player,
    "QuestCanceled",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.quest = quest.id;
  tx.save();
}

export function handleQuestCompleted(
  event: QuestCompleted,
): void {
  let quest = getOrCreateQuest(event.params.questId, event.params.player);
  quest.status = getQuestStatus(event.params.quest.status);
  quest.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.player,
    "QuestCompleted",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.quest = quest.id;
  tx.save();
}

export function handleQuestStarted(
  event: QuestStarted
): void {
  let quest = getOrCreateQuest(event.params.questId, event.params.player);
  let questDetail = event.params.quest;

  quest.address = questDetail.quest.toHexString();
  quest.type = getQuestTypeFromAddress(questDetail.quest.toHexString());
  
  let heroes = quest.heroes;
  heroes.push(event.params.heroId.toString());
  quest.heroes = heroes;

  quest.startTime = questDetail.startTime.toI32();
  quest.startBlock = questDetail.startBlock.toI32();
  quest.completeAtTime = questDetail.completeAtTime.toI32();
  quest.attempts = questDetail.attempts;
  quest.status = getQuestStatus(questDetail.status);
  quest.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.player,
    "QuestStarted",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.quest = quest.id;
  tx.save();
}

export function handleQuestReward(
  event: QuestReward
): void {
  if (isZeroAddress(event.params.rewardItem)) {
    return;
  }
  let questReward = getOrCreateQuestReward(
    event.params.questId,
    event.params.player,
    event.params.heroId,
    event.params.rewardItem,
    event.params.itemQuantity,
  )
  questReward.save()
}
