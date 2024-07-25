import { findShortestWordChain } from "./wordchain.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

async function startWordChainFinder() {
  console.log(
    "Welcome to the Word Chain Finder! Press ESC at any time to exit.\n"
  );

  process.stdin.setRawMode(true);
  process.stdin.resume();

  let endProgram = false;

  process.stdin.on("data", (key) => {
    if (key.toString() === "\u001b") {
      endProgram = true;
      console.log("\nESC key pressed. Exiting...");
      rl.close();
      process.exit();
    }
  });

  while (!endProgram) {
    const startWord = await askQuestion("Enter the starting word: ");
    if (startWord === null) break;

    const endWord = await askQuestion("Enter the ending word: ");
    if (endWord === null) break;

    let strictMode;
    if (startWord.length === endWord.length) {
      const answer = await askQuestion(
        "Do you want to disable strict mode? (y/n): "
      );
      if (answer === null) break;
      strictMode = answer.trim().toLowerCase().startsWith("n");
    } else {
      strictMode = false;
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
  process.stdin.setRawMode(false);
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (answer.trim() === "") {
        resolve(null);
      } else {
        resolve(answer.trim());
      }
    });
  });
}

startWordChainFinder();
