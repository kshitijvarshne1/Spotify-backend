const express = require("express");
const mysql = require("mysql");
let cors = require("cors");

// create connection

const db = mysql.createConnection({
  host: "localhost",
  user: "kshitijdb",
  password: "root@123",
  insecureAuth: true,
  database: "spotifydb",
});
// connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql connected.......");
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ status: "working" });
});

app.post("/addSong", (req, res) => {
  const date = new Date(req.body.date_of_release);
  let song = {
    name: req.body.name,
    date_of_release: date,
    artist_id: req.body.artist_id,
    rating: req.body.artist_id,
  };
  let sql = "INSERT into Song SET ?";
  db.query(sql, song, (err, result) => {
    if (err) throw err;
    res.send({ status: "song is added" });
  });
});

app.get("/getAllSong", (req, res) => {
  let sql =
    "select s.name as song_name,DATE_FORMAT(s.date_of_release,'%D %M %Y') as date, s.rating, a.name as artist_name from spotifydb.song as s left join spotifydb.artist as a on s.artist_id=a.artist_id limit 10;";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send({ data: result });
  });
});

app.post("/addArtist", (req, res) => {
  const date = new Date(req.body.dob);
  let artist = {
    name: req.body.name,
    dob: date,
  };
  let sql = "INSERT into Artist SET ?";
  db.query(sql, artist, (err, result) => {
    if (err) {
      res.send({ status: "Artist is not added" });
      throw err;
    }
    res.send({ status: "Artist is added" });
  });
});

app.get("/getAllArtist", (req, res) => {
  let sql = "select a.artist_id, a.name from spotifydb.artist as a";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send({ data: result });
  });
});

app.get("/get10Artist", async (req, res) => {
  let allArtistSql =
    "select artist_id as id, name, DATE_FORMAT(dob,'%D %M %Y') as dob from spotifydb.artist";
  let allSongSql = "select * from spotifydb.song";

  await db.query(allArtistSql, (err, res1) => {
    if (err) throw err;
    db.query(allSongSql, (err, res2) => {
      if (err) throw err;

      list = [];
      for (let i of res1) {
        obj = { id: i.id, name: i.name, dob: i.dob, listOfSong: [] };
        for (let j of res2) {
          if (j.artist_id == obj.id) {
            obj.listOfSong.push(j.name);
          }
        }
        list.push(obj);
      }
      res.send({ status: list });
    });
  });
});

app.listen("3000", () => {
  console.log("Server started on port 3000");
});
