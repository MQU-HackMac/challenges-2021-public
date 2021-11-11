import {
  initializeTestApp,
  clearFirestoreData,
  loadFirestoreRules,
  apps,
  assertFails,
  assertSucceeds,
  initializeAdminApp,
} from "@firebase/rules-unit-testing";
import {readFileSync, createWriteStream} from "fs";
import {get} from "http";

/**
 * The emulator will accept any project ID for testing.
 */
const PROJECT_ID = "firevault-1a5bc";

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
const COVERAGE_URL =
  `http://localhost:8080/emulator/v1/projects/${PROJECT_ID}:` +
  "ruleCoverage.html";

/**
 * @description Creates a new client FirebaseApp with authentication and returns
 * the Firestore instance.
 */
function getAuthedFirestore(auth) {
  return initializeTestApp({projectId: PROJECT_ID, auth}).firestore();
}

beforeEach(async () => {
  // Clear the database between tests
  await clearFirestoreData({projectId: PROJECT_ID});
});

before(async () => {
  // Load the rules file before the tests begin
  const rules = readFileSync(
    "/Users/jb/Repos/work/HackMac2021/challenges/cloud/FireVault/challenge/" +
      "firebase/firestore.rules",
    "utf8",
  );
  await loadFirestoreRules({projectId: PROJECT_ID, rules});
});

after(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(apps().map((app) => app.delete()));

  // Write the coverage report to a file
  const coverageFile = "firestore-coverage.html";
  const fstream = createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    get(COVERAGE_URL, (res) => {
      res.pipe(fstream, {end: true});

      res.on("end", resolve);
      res.on("error", reject);
    });
  });

  console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

describe("My app", () => {
  it("require users to log in before creating a profile", async () => {
    const db = getAuthedFirestore(null);
    const profile = db.collection("users").doc("alice");
    await assertFails(profile.set({birthday: "January 1"}));
  });

  it("should only allow a user to create their own profile", async () => {
    const uid = "testuser";
    const db = getAuthedFirestore({uid: uid});

    await assertSucceeds(db.collection("users").doc(uid).set({test: "data"}));

    await assertFails(
      db.collection("users").doc("otheruser").set({test: "data"}),
    );
  });

  it("should only allow a user to create a share for themselves", async () => {
    const uid = "testuser";
    const adminDb = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    adminDb.collection("users").doc(uid).set({numShares: 0});
    adminDb.collection("users").doc("otheruser").set({numShares: 0});

    const db = getAuthedFirestore({uid: uid});

    await assertSucceeds(
      db
        .collection("users")
        .doc(uid)
        .collection("shares")
        .add({
          files: [{path: "a/b", name: "b"}],
        }),
    );

    await assertFails(
      db
        .collection("users")
        .doc("otheruser")
        .collection("shares")
        .add({
          files: [{path: "a/c", name: "c"}],
        }),
    );
  });

  it("should only allow a user to read their own shares", async () => {
    const uid = "testuser";
    const db = getAuthedFirestore({uid: uid});

    await assertSucceeds(
      db.collection("users").doc(uid).collection("shares").get(),
    );

    await assertFails(
      db.collection("users").doc("otheruser").collection("shares").get(),
    );
  });

  it("should not allow a user to modify their shares", async () => {
    const uid = "testuser";
    const adminDb = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    const profile = adminDb.collection("users").doc(uid);
    profile.set({numShares: 0});
    profile.collection("shares").add({test: "data"});

    const db = getAuthedFirestore({uid: uid});

    await assertFails(
      (
        await db.collection("users").doc(uid).collection("shares").get()
      ).docs[0].ref.update({test: "new_data"}),
    );
  });

  it("should ensure that each user cannot create more than 3 shares", async () => {
    // Supported by function to set numShares
    const uid = "testuser";
    const adminDb = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    const profile = adminDb.collection("users").doc(uid);
    await profile.set({numShares: 0});

    for (let i = 0; i < 3; i++) {
      await profile.collection("shares").add({shareNum: i + 1});

      const prevNumShares = (await profile.get()).get("numShares");

      profile.update({numShares: prevNumShares + 1});
    }

    const db = getAuthedFirestore({uid: uid});

    await assertFails(
      db.collection("users").doc(uid).collection("shares").add({test: "data"}),
    );
  });

  it("should ensure that each share has a maximum of 5 files", async () => {
    // Supported by function to set numFiles
    const uid = "testuser";
    const adminDb = initializeAdminApp({projectId: PROJECT_ID}).firestore();

    const adminProfile = adminDb.collection("users").doc(uid);
    await adminProfile.set({numShares: 0});

    const db = getAuthedFirestore({uid: uid});
    const profile = db.collection("users").doc(uid);

    await assertSucceeds(
      profile.collection("shares").add({
        files: [
          {path: "a/b", name: "b"},
          {path: "a/c", name: "c"},
          {path: "a/d", name: "d"},
          {path: "a/e", name: "e"},
          {path: "a/f", name: "f"},
        ],
      }),
    );

    await assertFails(
      profile.collection("shares").add({
        files: [
          {path: "a/b", name: "b"},
          {path: "a/c", name: "c"},
          {path: "a/d", name: "d"},
          {path: "a/e", name: "e"},
          {path: "a/f", name: "f"},
          {path: "a/g", name: "g"},
        ],
      }),
    );
  });
});
