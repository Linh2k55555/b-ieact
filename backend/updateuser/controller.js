// controller.js (Updated)
import User from "../user/model.js";

// Fetch user information
export const getUserInfo = async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch the user from the database
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user information
export const updateUser = async (req, res) => {
  const { username, age } = req.body;

  try {
    // Check if user is authenticated
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      req.session.userId,
      { username, age },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update session with the new data
    req.session.username = updatedUser.username;
    req.session.age = updatedUser.age;

    // Respond with the updated user data
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
