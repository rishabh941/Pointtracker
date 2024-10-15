import User from "../models/users.model.js";
import ClaimHistory from "../models/claimsHistory.model.js";
export const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
};

export const claimPoints = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Username not found. If you are not registered, please register first.",
      });
    }

    const pointsAwarded = Math.floor(Math.random() * 10) + 1;

    user.Points += pointsAwarded;
    await user.save();

    await ClaimHistory.create({
      userId: user._id,
      pointsAwarded,
      username,
    });

    res.status(200).json({
      success: true,
      message: `${pointsAwarded} points claimed successfully!`,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const giveHistoryOfAUser = async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Username not found. Please register first.",
      });
    }

    // Get today's date at 12:00 AM (IST)
    const now = new Date();
    const istTimeOffset = 330; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + istTimeOffset * 60 * 1000); // Convert to IST
    const todayMidnight = new Date(
      istNow.getFullYear(),
      istNow.getMonth(),
      istNow.getDate(),
      0,
      0,
      0
    );
    const utcMidnight = new Date(
      todayMidnight.getTime() - istTimeOffset * 60 * 1000
    ); // Convert back to UTC

    // Aggregate the sum of points added after today's 12:00 AM (IST)
    const result = await ClaimHistory.aggregate([
      {
        $match: {
          username,
          createdAt: { $gte: utcMidnight },
        },
      },
      {
        $group: {
          _id: null, // No grouping key, just aggregate across all matched documents
          totalPoints: { $sum: "$points" }, // Assuming "points" is the field containing points
        },
      },
    ]);

    if (!result || result.length === 0 || !result[0].totalPoints) {
      return res.status(404).json({
        success: false,
        message: "No points added today after 12:00 AM (IST).",
      });
    }

    res.status(200).json({
      success: true,
      message: "Total points added today fetched successfully.",
      data: user,
      historyOfPoints: {
        totalPoints: result[0].totalPoints, // Return the sum of points
      },
    });
  } catch (error) {
    console.error("Error fetching claim history:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};
