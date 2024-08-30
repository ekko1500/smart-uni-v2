import { db } from "@/lib/firebase"; // Ensure the path is correct
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

const loginUser = async ({ email, password }) => {
  console.log(email, password);
  try {
    // Create a query to find the user with the provided email
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot);

    if (querySnapshot.empty) {
      throw new Error("Invalid email ");
    }

    // Assuming email is unique and there is only one user document
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Compare provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    console.log("User logged in successfully");
    return userData; // Return user data or relevant info
  } catch (error) {
    console.error("Error logging in user:", error);
    throw new Error("Error logging in user: " + error.message);
  }
};

export { loginUser };
