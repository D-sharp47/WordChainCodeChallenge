import { findShortestWordChain } from "./wordchain.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function startWordChainFinder() {
  console.log(
    "Welcome to the Word Chain Finder! Press ESC at any time to exit.\n"
  );

  while (true) {
    const startWord = await askQuestion("Enter the starting word: ");
    if (startWord === null) break; // User pressed ESC

    const endWord = await askQuestion("Enter the ending word: ");
    if (endWord === null) break; // User pressed ESC

    let strictMode;
    if (startWord.length === endWord.length) {
      const answer = await askQuestion(
        "Do you want to disable strict mode? (y/n): "
      );
      if (answer === null) break; // User pressed ESC
      strictMode = answer.trim().toLowerCase().startsWith("n");
    } else {
      strictMode = false; // Default strict mode if word lengths differ
    }

    const result = await findShortestWordChain(startWord, endWord, {
      strictMode,
      display: true,
    });
    if (result) {
      console.log("Word chain found!");
    } else {
      console.log("No word chain found.");
    }
  }

  console.log("Goodbye!");
  rl.close();
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (answer.trim() === "") {
        resolve(null); // User pressed ESC or entered an empty string
      } else {
        resolve(answer.trim());
      }
    });
  });
}

// Start the interactive word chain finder
startWordChainFinder();
