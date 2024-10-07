const firebaseConfig = {
    apiKey: "AIzaSyAekwrpB56A5Kib4H9YSwGMzeQap9ZMJAA",
    authDomain: "elfuturix-10101.firebaseapp.com",
    projectId: "elfuturix-10101",
    storageBucket: "elfuturix-10101.appspot.com",
    messagingSenderId: "1001074017564",
    appId: "1:1001074017564:web:3b9faa1c6bfc624622e6d9",
    measurementId: "G-6Q55QC0CPF"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function generateSequentialId() {
    const counterDoc = db.collection('counters').doc('studentCounter');
    
    return db.runTransaction(transaction => {
        return transaction.get(counterDoc).then(doc => {
            if (!doc.exists) {
                throw "Counter document does not exist!";
            }
            
            const newCounter = doc.data().counter + 1;
            transaction.update(counterDoc, { counter: newCounter });
            
            const studentId = 'STU' + String(newCounter).padStart(4, '0'); // Custom ID with padding
            return studentId;
        });
    });
}

function handleStudentLogin(email, firstName, lastName) {
    const studentDocRef = db.collection('students').doc(email); // Using email as the document ID
    studentDocRef.get().then((doc) => {
        if (!doc.exists) {
            // First-time login, generate custom student ID
            const studentId = generateSequentialId(firstName, lastName);
            studentDocRef.set({
                studentId: studentId,
                name: firstName + ' ' + lastName,
                email: email,
                registeredCompetitions: []
            }).then(() => {
                console.log("New student registered with ID:", studentId);
            }).catch((error) => {
                console.error("Error adding student: ", error);
            });
        } else {
            console.log("Student already exists:", doc.data().studentId);
        }
    }).catch((error) => {
        console.error("Error fetching student document: ", error);
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

export {handleStudentLogin,registerForCompetition,isStudentRegisteredForCompetition,createTeam,getStudentByEmail}
