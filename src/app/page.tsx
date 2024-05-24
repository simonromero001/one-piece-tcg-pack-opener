"use client";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import Tilt from "react-parallax-tilt";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [packId, setPackId] = useState("");
  const [flipping, setFlipping] = useState(false); // Add flipping state

  const createPack = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/packs/create-pack",
        {
          name: "Common Pack",
        }
      );
      const newPackId = response.data.pack._id;
      console.log("Pack created with ID:", newPackId);
      setPackId(newPackId);
      return newPackId;
    } catch (error) {
      console.error("Error creating pack:", error);
      return null;
    }
  };

  const openPack = async (packId) => {
    if (!packId) {
      console.error("Pack ID is not set.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/packs/open",
        { packId }
      );
      const fetchedCards = response.data.map((card) => ({
        ...card,
        isFlipped: false,
      }));

      setTimeout(() => {
        setCards(fetchedCards);
        setTimeout(() => flipCardsOneByOne(0), 500); // Start flipping the cards from the first one with a delay
      }, 500); // Add delay before setting the cards
    } catch (error) {
      console.error("Error opening pack:", error);
    }
  };

  const flipCardsOneByOne = (index) => {
    if (index === 0) setFlipping(true); // Set flipping state to true at the start

    if (index >= cards.length) {
      setFlipping(false); // Set flipping state to false when done
      return;
    }

    setCards((prevCards) =>
      prevCards.map((card, i) =>
        i === index ? { ...card, isFlipped: true } : card
      )
    );

    // Auto-scroll functionality
    const cardElement = document.getElementById(`card-${index}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    setTimeout(() => flipCardsOneByOne(index + 1), 500); // Adjust the delay for smoother effect
  };

  const handleOpenNewPack = async () => {
    if (flipping) {
      console.error("Cards are flipping, cannot open a new pack.");
      return;
    }

    const newPackId = await createPack();
    if (newPackId) {
      openPack(newPackId);
    } else {
      console.error("Failed to create pack, cannot open pack.");
    }
  };

  return (
    <div className="bg-white flex flex-col items-center w-full min-h-screen">
      <div className="w-full max-w-[1440px] p-4">
        <div className="flex justify-between items-center bg-white py-4">
          <p className="font-body-text font-bold text-black text-lg">
            One Piece TCG Pack Opener
          </p>
          {/*
          <div className="flex items-center gap-4 px-4 py-2">
            <Menu>
              <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                Packs
              </MenuButton>
              <Transition
                enter="transition ease-out duration-75"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <MenuItems
                  anchor="bottom end"
                  className="w-52 origin-top-right rounded-xl border border-white/5 bg-black p-1 text-sm/6 text-white [--anchor-gap:var(--spacing-1)] focus:outline-none"
                >
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-center">
                      Romance Dawn [OP-01]
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-center">
                      Paramount War [OP-02]
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-center">
                      Pillars of Strength [OP-03]
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-center">
                      Kingdoms of Intrigue [OP-04]
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-center">
                      Awakening of the New Era [OP-05]
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 text-center">
                      Wings of the Captain [OP-06]
                    </button>
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
                  */}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={handleOpenNewPack}
            className={`px-6 py-4 bg-black text-white rounded-md shadow-md ${
              flipping ? "opacity-50 cursor-not-allowed" : ""
            }`} // Disable button visually
            disabled={flipping} // Disable button functionality
          >
            Open New Pack
          </button>
        </div>
        {/* Start of Grid of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {cards.map((card, index) => (
            <Tilt
              key={index}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1000}
              glareEnable={true}
              glareMaxOpacity={0.1}
              glareColor="rgba(0,0,0,0.3)"
              glarePosition="bottom"
              glareBorderRadius="10px"
            >
              <div
                id={`card-${index}`}
                className="tiltComponent shadow-lg hover:transform hover:translate-z-5 hover:scale-105 hover:shadow-2xl transition-transform duration-500 ease-in-out"
              >
                <div className={`card ${card.isFlipped ? "is-flipped" : ""}`}>
                  <div className="card-inner" style={{ position: "relative" }}>
                    <div
                      className="card-front"
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <img
                        className="object-cover w-full h-auto transition-opacity duration-500 ease-in-out"
                        alt={`Card ${index + 1}`}
                        src={`http://localhost:5000${card.imageUrl}`}
                      />
                    </div>
                    <div
                      className="card-back"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <img
                        className="object-cover w-full h-auto transition-opacity duration-500 ease-in-out"
                        alt="Card Back"
                        src="/resources/opcardback.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
        {/* End of Grid of cards */}
      </div>
    </div>
  );
}
