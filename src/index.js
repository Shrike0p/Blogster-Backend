const express = require('express');
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/user');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Needed to parse JSON request bodies

// Register routes
app.use('/api/v1/blog', blogRoutes);  // Mount blog routes here
app.use('/api/v1/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
