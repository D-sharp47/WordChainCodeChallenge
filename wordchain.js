import wordList from "wordlist-english";
const words = wordList["english"];

let isNeighborCalls = 0;
let totalWordsProcessed = 0;
let maxQueueSize = 0;
let maxDepth = 0;

export async function findShortestWordChain(
  startWord,
  endWord,
  { strictMode = startWord.length === endWord.length, display = false } = {}
) {
  startWord = startWord.toLowerCase();
  endWord = endWord.toLowerCase();

  isNeighborCalls = 0;
  totalWordsProcessed = 0;
  maxQueueSize = 0;
  maxDepth = 0;

  if (!words.includes(startWord) || !words.includes(endWord)) {
    if (display) {
      console.log("Start or end word is not in the word list.");
    }
    return null;
  }

  if (startWord === endWord) {
    const result = {
      wordChain: [startWord],
      metrics: {
        wordComparisons: 0,
        uniqueWordsProcessed: 1,
        maxDepth: 0,
      },
      startWord,
      endWord,
      strictMode,
    };

    if (display) {
      displayResult(result);
    }

    return result;
  }

  let queue = [[startWord]];

  let visited = new Set();
  visited.add(startWord);

  while (queue.length > 0) {
    if (queue.length > maxQueueSize) {
      maxQueueSize = queue.length;
    }
    let currentPath = queue.shift();
    let currentWord = currentPath[currentPath.length - 1];

    if (currentPath.length - 1 > maxDepth) {
      maxDepth = currentPath.length - 1;
    }

    totalWordsProcessed++;

    let neighbors = getNeighbors(currentWord, strictMode);

    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        let newPath = [...currentPath, neighbor];

        if (neighbor === endWord) {
          const result = {
            wordChain: newPath,
            metrics: {
              wordComparisons: isNeighborCalls,
              uniqueWordsProcessed: visited.size,
              maxDepth: newPath.length - 1,
            },
            startWord,
            endWord,
            strictMode,
          };

          if (display) {
            displayResult(result);
          }

          return result;
        } else {
          queue.push(newPath);
        }
      }
    }
  }

  if (display) {
    console.log("No chain found.");
  }
  return null;
}

function getNeighbors(word, strictMode) {
  let neighbors = words.filter((w) => isNeighbor(word, w, strictMode));

  return neighbors;
}

function isNeighbor(word1, word2, strictMode) {
  isNeighborCalls++;

  if (strictMode) {
    if (word1.length !== word2.length) {
      return false;
    }
    let diffCount = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) {
        diffCount++;
        if (diffCount > 1) return false;
      }
    }
    return diffCount === 1;
  } else {
    if (Math.abs(word1.length - word2.length) > 1) {
      return false;
    }
    if (word1.length === word2.length) {
      let diffCount = 0;
      for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) {
          diffCount++;
          if (diffCount > 1) return false;
        }
      }
      return diffCount === 1;
    } else {
      let longer = word1.length > word2.length ? word1 : word2;
      let shorter = word1.length > word2.length ? word2 : word1;
      let mismatchFound = false;
      // checks if there is more than one difference between the words
      for (let i = 0, j = 0; i < longer.length; i++, j++) {
        if (longer[i] !== shorter[j]) {
          if (mismatchFound) return false;
          mismatchFound = true;
          j--;
        }
      }
      return true;
    }
  }
}

function displayResult(result) {
  console.log(
    `\nStart Word: ${result.startWord}, End Word: ${result.endWord}, Strict Mode: ${result.strictMode}`
  );
  console.log(`Word Chain: ${result.wordChain.join(" -> ")}`);
  console.log("Metrics: ", result.metrics, "\n");
}
