import { Address } from "@graphprotocol/graph-ts";
import {
  MeditationBegun,
  MeditationCompleted,
} from "../../generated/MeditationCircle/MeditationCircle";
import {
  getOrCreateTransaction,
  getOrCreateMeditation,
} from "./common"
import {
  getHeroStat,
} from "./mapping"

export function handleMeditationBegun(
  event: MeditationBegun,
): void {
  let meditation = getOrCreateMeditation(
    event.params.meditationId,
    event.params.player,
    event.params.heroId,
  );
  meditation.status = "Begun";
  meditation.primaryStat = getHeroStat(event.params.primaryStat);
  meditation.secondaryStat = getHeroStat(event.params.secondaryStat);
  meditation.tertiaryStat = getHeroStat(event.params.tertiaryStat);
  meditation.attunementCrystal = event.params.attunementCrystal.toHex();
  meditation.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.player,
    "HeroMeditationBegun",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.meditation = meditation.id;
  tx.save();
}

export function handleMeditationCompleted(
  event: MeditationCompleted,
): void {
  let meditation = getOrCreateMeditation(
    event.params.meditationId,
    event.params.player,
    event.params.heroId,
  );
  meditation.status = "Completed";
  meditation.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.player,
    "HeroMeditationCompleted",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.meditation = meditation.id;
  tx.save();
}
