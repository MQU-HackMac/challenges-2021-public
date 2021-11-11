import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

/**
 * Helper functions for firebase auth
 */
export default class Authentication {
  /**
   * @description: A firebase function that ensures there are only 50 users
   * registered by deleting the oldest user.
   * @return: {object} - A promise that resolves when the function is done.
   */
  public static async deleteOldestUser(maxUsers: number): Promise<void> {
    const users = (await admin.auth().listUsers()).users;
    const numToDelete = Math.max(0, users.length - maxUsers);

    const usersToDelete = users
      .sort((a, b) => {
        return (
          new Date(a.metadata.creationTime).getTime() -
          new Date(b.metadata.creationTime).getTime()
        );
      })
      .slice(0, numToDelete);

    functions.logger.debug(`Deleting ${numToDelete} users`);

    await Promise.all(
      usersToDelete.map(
        async (user) => await admin.auth().deleteUser(user.uid),
      ),
    );
  }
}
