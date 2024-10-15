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
  const { username, page = 1, limit = 10 } = req.body; // Default page to 1 and limit to 10

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

    const claimHistory = await ClaimHistory.find({ userId: user._id })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await ClaimHistory.countDocuments({ userId: user._id });

    if (claimHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No claim history found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Claim history fetched successfully.",
      data: claimHistory,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        itemsPerPage: limit,
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
