const app = require("./app"); // ✅ Correctly importing the Express app
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
