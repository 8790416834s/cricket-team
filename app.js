const express = require("express");
const app = express();
module.exports = app;
app.use(express.json());
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started at http://localhost:3000/....");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};
//get all players
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT * FROM cricket_team
    ORDER BY player_id;`;
  const playerArray = await db.all(getPlayersQuery);
  response.send(
    playerArray.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});
//get single player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT * FROM cricket_team
    WHERE player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});
//post
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
  const player = await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

//put
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const playerUpdateQuery = `UPDATE cricket_team
    SET
        player_name = '${playerName}',
        jersey_number = ${jerseyNumber},
        role = '${role}'
    WHERE 
        player_Id = ${playerId};`;
  const player = await db.run(playerUpdateQuery);
  response.send("Player Details Updated");
});

//delete
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDeleteQuery = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};`;
  await db.run(playerDeleteQuery);
  response.send("Player Removed");
});
