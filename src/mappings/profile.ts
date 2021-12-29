import {
  Profile,
} from "../../generated/schema";
import {
  ProfileCreated,
  ProfileUpdated,
} from "../../generated/Profile/Profile";
import {
  getOrCreateAccount,
  getOrCreateTransaction,
} from './common'

export function handleProfileCreated(
  event: ProfileCreated
): void {
  let profile = new Profile(event.params.profileId.toString());
  let player = getOrCreateAccount(event.params.owner.toHex());
  profile.player = player.id;
  profile.name = event.params.name;
  profile.createdAt = event.params.created;
  profile.picId = event.params.picId;
  profile.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.owner,
    "ProfileCreated",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.profile = profile.id;
  tx.save();
}

export function handleProfileUpdated(
  event: ProfileUpdated
): void {
  let profile = Profile.load(event.params.profileId.toString());
  profile.name = event.params.name;
  profile.picId = event.params.picId;
  profile.heroId = event.params.heroId;
  profile.save();

  let tx = getOrCreateTransaction(
    event.block.number,
    event.transaction.hash,
    event.params.owner,
    "ProfileUpdated",
    event.transaction.value,
    event.address,
    event.transaction.gasPrice,
    event.transaction.gasUsed,
    event.block.timestamp,
  )
  tx.profile = profile.id;
  tx.save();
}
