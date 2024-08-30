import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

// Add a new user
const addUser = async ({ username, email, password, role }) => {
  try {
    // Create a new document with auto-generated ID
    const userRef = await addDoc(collection(db, "users"), {
      username,
      email,
      password,
      role,
    });

    // Update the document with the generated ID as userId
    await updateDoc(doc(db, "users", userRef.id), { userId: userRef.id });

    console.log("User added successfully");
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

const fetchUserById = async (userId) => {
  // console.log(userId);
  try {
    // Create a query against the collection
    const q = query(collection(db, "users"), where("userId", "==", userId));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if any documents were found
    if (!querySnapshot.empty) {
      // Assume there's only one matching document and return its data
      const userData = querySnapshot.docs[0].data();
      return userData;
    } else {
      // console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw error; // Optionally, re-throw the error to handle it elsewhere
  }
};

// Update a user
const updateUser = async (userId, updatedData) => {
  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, updatedData);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error updating user: ", error);
  }
};

// Retrieve users
const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("Error getting users: ", error);
  }
};

const addReport = async (values) => {
  try {
    const docRef = await addDoc(collection(db, "reports"), values);
    console.log("Document written with ID: ", docRef.id);

    await updateDoc(doc(db, "reports", docRef.id), {
      id: docRef.id, // Assign Firestore-generated ID to the 'id' field
    });

    const url = `http://localhost:3000/send-message`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          description: values.description,
          imageUrl: values.imageUrl,
          location: values.location,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const result = await response.json();
      console.log("Message sent successfully:", result);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    console.log("Document updated successfully.");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getReports = async (): Promise<Report[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "reports"));
    const docs: Report[] = [];
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() } as Report);
    });
    return docs;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

const getReportById = async (reportId) => {
  try {
    if (!reportId) {
      throw new Error("Invalid report ID");
    }

    const docRef = doc(db, "reports", reportId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting report:", error);
    throw error; // Optional: Throw the error for handling in the caller
  }
};

const updateSeenStatus = async (reportId) => {
  try {
    if (!reportId) {
      throw new Error("Invalid report ID");
    }

    const docRef = doc(db, "reports", reportId);

    await updateDoc(docRef, {
      seen: true,
    });

    console.log("Document updated successfully!");
  } catch (error) {
    console.error("Error updating document:", error);
    throw error; // Optional: Throw the error for handling in the caller
  }
};

const updateReportStatus = async (reportId, newStatus) => {
  try {
    if (!reportId || !newStatus) {
      throw new Error("Invalid report ID or status");
    }

    const docRef = doc(db, "reports", reportId);
    await updateDoc(docRef, {
      status: newStatus,
    });

    console.log("Status updated successfully!");
  } catch (error) {
    console.error("Error updating status:", error);
    throw error; // Optional: Throw the error for handling in the caller
  }
};

/* ---------------------------------- RFID ---------------------------------- */
const createRFID = async (data) => {
  try {
    // First, retrieve the user document based on the username
    const usersQuery = query(
      collection(db, "users"),
      where("username", "==", data.username)
    );
    const querySnapshot = await getDocs(usersQuery);

    if (querySnapshot.empty) {
      alert("No user found with the specified username");
      return;
    }

    // Assume the first document in the result is the correct user
    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.id; // Get the userId from the document ID

    // Now, create the new document in the "rfid_cards" collection
    await addDoc(collection(db, "rfid_cards"), {
      rfidId: data.rfidId,
      userId: userId,
      status: "out",
    });

    alert("User registered successfully");
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Failed to register user");
  }
};

const fetchRFIDS = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "rfid_cards"));
    const datas = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return datas;
  } catch (error) {
    console.error("Error getting RFID-cards: ", error);
  }
};

async function fetchRFIDCardsWithStatusIn() {
  try {
    // Reference to the 'rfid_cards' collection
    const rfidCardsCollection = collection(db, "rfid_cards");

    // Create a query against the collection
    const q = query(rfidCardsCollection, where("status", "==", "in"));

    // Execute the query
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
  }
}

const deleteRFIDById = async (rfidId) => {
  try {
    // Query the collection to find the document with the specific rfidId
    const q = query(
      collection(db, "rfid_cards"),
      where("rfidId", "==", rfidId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If the document exists, delete it
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "rfid_cards", document.id));
      });
      console.log(`Document with rfidId: ${rfidId} deleted successfully.`);
    } else {
      console.log(`No document found with rfidId: ${rfidId}.`);
    }
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

const fetchUsernamesNotInRFIDCards = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersNotInRFIDCards = [];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const username = userDoc.data().username;

      const rfidQuery = query(
        collection(db, "rfid_cards"),
        where("userId", "==", userId)
      );
      const rfidSnapshot = await getDocs(rfidQuery);

      if (rfidSnapshot.empty) {
        usersNotInRFIDCards.push({ userId, username });
      }
    }

    return usersNotInRFIDCards;
  } catch (error) {
    console.error("Error fetching usernames: ", error);
    throw new Error("Failed to fetch usernames");
  }
};

export {
  //users
  addUser,
  updateUser,
  getUsers,
  fetchUserById,
  addReport,
  getReports,
  getReportById,
  updateSeenStatus,
  updateReportStatus,
  //RFID
  createRFID,
  fetchRFIDCardsWithStatusIn,
  fetchRFIDS,
  deleteRFIDById,
  fetchUsernamesNotInRFIDCards,
};
