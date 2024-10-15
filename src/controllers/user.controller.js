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

export const getTodayHistory = async (req, res) => {
  try {
    // Get today's date in IST
    const today = new Date();
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // IST offset from UTC
    const todayStart = new Date(today.setUTCHours(0, 0, 0, 0) + istOffset); // Start of the day in IST
    const todayEnd = new Date(today.setUTCHours(23, 59, 59, 999) + istOffset); // End of the day in IST

    const todayData = await ClaimHistory.aggregate([
      {
        $match: {
          createdAt: {
            $gte: todayStart, // Filter for records created from start of today
            $lt: todayEnd, // Until the end of today
          },
        },
      },
      {
        $group: {
          _id: "$username", // Group by username
          totalPointsAwarded: { $sum: "$pointsAwarded" }, // Sum the pointsAwarded
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Today's history fetched successfully.",
      data: todayData,
    });
  } catch (error) {
    console.error("Error fetching today's history:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

export const getWeeklyData = async (req, res) => {
  try {
    // Get the current date and calculate the date for the last Monday
    const currentDate = new Date();
    const lastMonday = new Date();
    lastMonday.setDate(
      currentDate.getDate() - ((currentDate.getDay() + 6) % 7)
    ); // Calculate last Monday

    const weeklyData = await ClaimHistory.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastMonday, // Filter for records created from last Monday onwards
            $lt: new Date(currentDate.setDate(currentDate.getDate() + 1)), // Until the end of the week
          },
        },
      },
      {
        $group: {
          _id: "$username", // Group by username
          totalPoints: { $sum: "$pointsAwarded" }, // Sum the points
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Weekly data fetched successfully.",
      data: weeklyData,
    });
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

export const getMonthlyData = async (req, res) => {
  try {
    // Get the current date and calculate the start of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ); // Start of this month
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ); // End of this month

    const monthlyData = await ClaimHistory.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth, // Filter for records created from the start of the month
            $lt: endOfMonth, // Until the end of the month
          },
        },
      },
      {
        $group: {
          _id: "$username", // Group by username
          totalPointsAwarded: { $sum: "$pointsAwarded" }, // Sum the pointsAwarded
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Monthly data fetched successfully.",
      data: monthlyData,
    });
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};
