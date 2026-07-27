// @desc    Get content for the Home page
// @route   GET /api/content/home
exports.getHomeContent = async (req, res) => {
  try {
    res.status(200).json({
      title: 'Welcome to FullStack Auth App',
      subtitle: 'A MERN stack app with JWT authentication, real-time activity, and an AI chatbot.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get content for the About page
// @route   GET /api/content/about
exports.getAboutContent = async (req, res) => {
  try {
    res.status(200).json({
      title: 'About This Project',
      description:
        'This is a full-stack authentication app built with React, Node.js, Express, and MongoDB.',
      features: [
        'JWT authentication using httpOnly cookies (30-minute access token)',
        'Register, login, forgot/reset password flows',
        'Protected routes with automatic redirect on session expiry',
        'Real-time login activity via Socket.io',
        'AI chatbot powered by Gemini and Groq',
      ],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};