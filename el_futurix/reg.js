
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, collection, setDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDULqoxGCXzqie03gmHrKt-BqJ-4lrtYCI",
    authDomain: "elfuturix-562eb.firebaseapp.com",
    projectId: "elfuturix-562eb",
    storageBucket: "elfuturix-562eb.appspot.com",
    messagingSenderId: "518115904118",
    appId: "1:518115904118:web:c5214283690b6619b52d57",
    measurementId: "G-DQW58LGMHR"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


function generateSequentialId() {
    const db = getFirestore(); // Ensure Firestore is initialized properly

    const counterDoc = doc(collection(db, 'counters'), 'studentCounter'); // Reference to counter document

    // Using runTransaction to update the counter atomically
    return runTransaction(db, async (transaction) => {
        const docSnapshot = await transaction.get(counterDoc);

        if (!docSnapshot.exists()) {
            throw new Error("Counter document does not exist!");
        }

        const newCounter = docSnapshot.data().counter + 1;
        transaction.update(counterDoc, { counter: newCounter });

        // Generate custom student ID with zero padding
        const studentId = 'EL-' + String(newCounter).padStart(4, '0');
        return studentId;
    }).catch((error) => {
        console.error("Transaction failed: ", error);
        throw error;
    });
}

function get_details() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                resolve({
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid
                });
            } else {
                // No user is signed in
                resolve(false);
            }
        }, (error) => {
            // If there’s an error in auth state change
            reject(error);
        });
    });
}

function postFirstLogin(obj) {
    return new Promise((resolve, reject) => {
        get_details()
            .then((userDetails) => {
                if (userDetails) {
                    const studentDocRef = doc(collection(db, 'students'), userDetails.email);
                    
                    generateSequentialId()
                        .then((id) => {
                            obj.id = id;
                            return setDoc(studentDocRef, obj);
                        })
                        .then(() => {
                            console.log("New student registered with ID:", obj.id);
                            resolve(`New student registered with ID: ${obj.id}`);
                        })
                        .catch((error) => {
                            console.error("Error adding student:", error);
                            reject(`Error adding student: ${error}`);
                        });
                } else {
                    console.log("No user is signed in.");
                    reject("No user is signed in. Login before registering.");
                }
            })
            .catch((error) => {
                console.error("Error getting user details:", error);
                reject(`Error getting user details: ${error}`);
            });
    });
}



function registerForCompetition(studentId, competitionId, teamId = null) {
    const studentDocRef = db.collection('students').doc(studentId);
    studentDocRef.update({
        registeredCompetitions: firebase.firestore.FieldValue.arrayUnion({
            competitionId: competitionId,
            teamId: teamId,
            role: teamId ? "teamLeader" : "individual" // Assuming "individual" if no team is created
        })
    }).then(() => {
        console.log("Student registered for competition:", competitionId);
    }).catch((error) => {
        console.error("Error registering for competition: ", error);
    });
}

function createTeam(studentId, competitionId, teamName, memberIds) {
    const teamDocRef = db.collection('teams').doc();

    // Verify that all member IDs exist
    const memberPromises = memberIds.map((id) => db.collection('students').doc(id).get());

    Promise.all(memberPromises).then((docs) => {
        const validMembers = docs.filter(doc => doc.exists).map(doc => ({
            studentId: doc.id,
            role: "member"
        }));

        // Add team creator as the leader
        validMembers.push({ studentId: studentId, role: "teamLeader" });

        // Create the team
        teamDocRef.set({
            teamName: teamName,
            competitionId: competitionId,
            members: validMembers,
            createdAt: firebase.firestore.Timestamp.now()
        }).then(() => {
            console.log("Team created successfully:", teamName);
        }).catch((error) => {
            console.error("Error creating team: ", error);
        });
    }).catch((error) => {
        console.error("Error validating members: ", error);
    });
}

function isStudentRegisteredForCompetition(studentId, competitionId) {
    const studentDocRef = db.collection('students').doc(studentId);

    studentDocRef.get().then((doc) => {
        if (doc.exists) {
            const registeredCompetitions = doc.data().registeredCompetitions || [];
            const isRegistered = registeredCompetitions.some(
                (comp) => comp.competitionId === competitionId
            );

            if (isRegistered) {
                console.log(`Student ${studentId} is registered for competition ${competitionId}.`);
            } else {
                console.log(`Student ${studentId} is NOT registered for competition ${competitionId}.`);
            }
        }
    }).catch((error) => {
        console.error("Error fetching student document: ", error);
    });
}

function getStudentByEmail(email) {
    const studentDocRef = db.collection('students').doc(email);

    studentDocRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Student found:", doc.data());
        } else {
            console.log("No student found with email:", email);
        }
    }).catch((error) => {
        console.error("Error fetching student by email:", error);
    });
}

export { registerForCompetition, isStudentRegisteredForCompetition, createTeam, getStudentByEmail, postFirstLogin, get_details }
