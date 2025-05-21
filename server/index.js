const express = require("express");
const cors = require("cors");
const db = require("./models");
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());



app.use("/users", require("./routes/Users"));
app.use("/matches", require("./routes/Matches"));
app.use("/participants", require("./routes/Participants"));


const PORT = process.env.PORT || 5000;

(async () => {
  try { 
    await db.sequelize.authenticate();
    console.log("Połączono z bazą danych.");

    
    await db.User.sync({ alter: true });
    await db.Match.sync({ alter: true });
    await db.Participant.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
    });
  } catch (err) {
    console.error("Błąd połączenia lub synchronizacji:", err);
  }
})();     