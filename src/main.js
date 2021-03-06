// This is the main triggering script that renders
// a kaboom.js engine running

import dp from "./sprites/sola.png";
import platform from "./sprites/platform.png";
import star from "./sprites/star.png";
import ladder from "./sprites/ladder.png";
import { getPosition, getAngle } from "./randoms";
import { players } from "./multiplayer";
import { config } from "./config";
import { maps } from "./levels";

const k = kaboom(config);
k.loadSprite("dp", dp);
k.loadSprite("star", star);
k.loadSprite("platform", platform);
k.loadSprite("ladder", ladder);

// data structures
let player_avatars = [];

// add a star to level
const AddStar = () => {
  const { x, y } = getPosition(config.width - 100, config.height - 100);
  k.add([
    k.sprite("star"),
    k.scale(0.25),
    k.rotate(getAngle()),
    k.pos(x, y),
    k.solid(),
    "star",
  ]);
};

// main scene
k.scene("main", () => {
  // main level
  const randomMap = maps[Math.floor(Math.random() * maps.length)]; //The Random map
  k.addLevel(randomMap, {
    height: 150,
    width: 50,
    "-": [k.sprite("platform"), k.scale(0.1), k.solid(), "platform"],
    "|": [k.sprite("platform"), k.scale(0.1), k.solid(), "platform"],
    //TODO: add declaration for '?' blocks
  });

  // add the first start
  AddStar();

  // adding all players
  let pointer = 0;
  players.forEach((player) => {
    const temp = k.add([
      k.sprite("dp"),
      k.scale(0.25),
      k.pos(pointer, 0),
      k.body({ jumpForce: 640 }),
      player,
    ]);
    player_avatars.push(temp);
    pointer += 300;
  });

  // key controls
  let myplayer = 0; // testing
  k.keyPress("space", () => {
    player_avatars[myplayer].jump(300);
  });
  k.keyDown("left", () => {
    player_avatars[myplayer].move(-300, 0);
  });
  k.keyDown("right", () => {
    player_avatars[myplayer].move(300, 0);
  });

  // star collision
  players.forEach((player) => {
    k.collides("star", player, (s, p) => {
      console.log(p._tags[0]);
      k.destroy(s);
      AddStar(); //TODO: enable it
    });
  });
  console.log(player_avatars);
});

// start the game
k.start("main");
