import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import { Fade } from "react-awesome-reveal";
import { motion } from "framer-motion";
export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];
const icon = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fill: "rgba(255, 255, 255, 0)",
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    fill: "rgba(255, 255, 255, 1)",
  },
};


export function StartScreen({ start }) {
  return (
    <>
    <section className="h-screen w-screen flex items-center bg-black justify-center flex-col w-content p-15 sm:p-40 md:p-10 lg:p-40 xl:p-10 text-gray-300 transition all duration-500 ease-in-out">
      <div className="w-1/2 h-auto flex mb-4 rounded-2 p-5 items-center justify-center bg-black">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-56% overflow-visible stroke-white text-white stroke-2 stroke-linejoin-round stroke-linecap-round p-1"
        >
          <motion.path
            d="M0 100V0l50 50 50-50v100L75 75l-25 25-25-25z"
            variants={icon}
            initial="hidden"
            animate="visible"
            transition={{
              default: { duration: 2, ease: "easeInOut" },
              fill: { duration: 2, ease: [1, 0, 0.8, 1] },
            }}
          />
        </motion.svg>
      </div>
      <Fade
        cascade
        damping={0.5}
        delay={1500}
        className="flex flex-col items-center justify-center"
        >
          <p className="text-grey-300 text mb-3 text-s uppercase font-bold">
            memory
        </p>
        <p className="text-grey-300 text mb-4 text-xs capitalize">
          powered by mightymeld
        </p>
        <button
          onClick={start}
          className="bg-black-400 text-white pt-1.5 pb-1.5 w-full rounded-xl min-w-[200px] shadow-[0_0_10px_#ddd] mt-1 hover:shadow-[0_0_20px_#ddd]"
        >
          play
        </button>
      </Fade>
      </section>
      </>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center relative p-20">
      <div className="w-full h-full grid grid-cols-2 items-center justify-center">
        {getTiles(6).map((tile, i) => (
          <div  className="bg-black-500 rounded-xl m-2 bg-red p-4 items-center justify-self-center shadow-[0_0_10px_#ddd] font-bold text-3xl cursor-pointer">
             <Tile key={i} flip={() => flip(i)} {...tile}/>
          </div>
        ))}
      </div>
      <div className="p-2 text-white absolute top-1 right-1 bg-black w-1/6 h-40px rounded-xl shadow-[0_0_10px_#ddd] flex items-center justify-center text-2xl mt-4 mr-4">
        {tryCount}
      </div> 
    </div>
  );
}
