import { deleteAvatarObject, listAvatarObjects } from '../awsS3/avatar.js';
import { UserDB } from '../models/userSchema.js';

const ORPHAN_GRACE_PERIOD = 24 * 60 * 60 * 1000;

export const cleanupOrphanAvatars = async () => {
  // 1. get all the users
  const users = await UserDB.find({}, { _id: 1, avatarKey: 1 });

  const now = Date.now();

  // 2. process each user
  for (const user of users) {
    const currentAvatarKey = user.avatarKey;

    // 2.1. get object list for user
    const objects = await listAvatarObjects(String(user._id));

    // 2.2. process each object
    for (const object of objects) {
      const key = object.Key;
      const lastModified = object.LastModified;

      if (!key || !lastModified) continue;

      // skip - current avatar; always keep it
      if (key === currentAvatarKey) continue;

      // skip - avatar less than 24h
      const age = now - lastModified.getTime();
      if (age < ORPHAN_GRACE_PERIOD) continue;

      // delete avatar object
      await deleteAvatarObject(key);
    }
  }
};
