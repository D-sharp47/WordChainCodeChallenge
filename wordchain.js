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
  // Convert words to lowercase for consistency
  startWord = startWord.toLowerCase();
  endWord = endWord.toLowerCase();

  // Reset metrics counters
  isNeighborCalls = 0;
  totalWordsProcessed = 0;
  maxQueueSize = 0;
  maxDepth = 0;

  // Check if startWord and endWord are valid words
  if (!words.includes(startWord) || !words.includes(endWord)) {
    if (display) {
      console.log("Start or end word is not in the word list.");
    }
    return null;
  }

  // If start and end words are the same, return immediately
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

  // Queue for BFS
  let queue = [[startWord]];

  // Visited set to avoid cycles
  let visited = new Set();
  visited.add(startWord);

  while (queue.length > 0) {
    // Update maximum queue size
    if (queue.length > maxQueueSize) {
      maxQueueSize = queue.length;
    }
    let currentPath = queue.shift();
    let currentWord = currentPath[currentPath.length - 1];

    // Update maximum depth of BFS tree
    if (currentPath.length - 1 > maxDepth) {
      maxDepth = currentPath.length - 1;
    }

    // Increment total words processed for current word
    totalWordsProcessed++;

    // Get neighboring words based on strictMode
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

  // If no path found
  if (display) {
    console.log("No chain found.");
  }
  return null;
}

function getNeighbors(word, strictMode) {
  // Filter words that differ by exactly one character
  let neighbors = words.filter((w) => isNeighbor(word, w, strictMode));

  return neighbors;
}

function isNeighbor(word1, word2, strictMode) {
  isNeighborCalls++;
  if (Math.abs(word1.length - word2.length) > 1) {
    return false; // More than one character difference, not neighbors
  } else if (word1.length === word2.length) {
    // Check for character differences
    let diffCount = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) {
        diffCount++;
        if (diffCount > 1) return false; // More than one character difference
      }
    }
    return diffCount === 1; // Exactly one character difference
  }

  // Non-strict mode: check for insertion or deletion
  if (!strictMode) {
    let minLength = Math.min(word1.length, word2.length);
    let mismatchFound = false;
    for (let i = 0, j = 0; i < minLength; i++, j++) {
      if (word1[i] !== word2[j]) {
        if (mismatchFound) return false; // More than one mismatch
        mismatchFound = true;
        if (word1.length > word2.length) {
          j--; // Skip one character in word2 for deletion
        } else {
          i--; // Skip one character in word1 for insertion
        }
      }
    }
    return true; // Exactly one insertion or deletion found
  }

  return false; // No valid neighbor found
}

function displayResult(result) {
  console.log(
    `\nStart Word: ${result.startWord}, End Word: ${result.endWord}, Strict Mode: ${result.strictMode}`
  );
  console.log(`Word Chain: ${result.wordChain.join(" -> ")}`);
  console.log("Metrics: ", result.metrics, "\n");
}

// Note: needs await if saving result to a variable
// // Example usage with strictMode automatically determined
// findShortestWordChain("hit", "ate", { display: true });

// // Example usage with strictMode set to false (insertions and deletions allowed)
// findShortestWordChain("hit", "ate", { strictMode: false, display: true });

// // Example usage with strictMode defaulted to false since word lengths differ
// findShortestWordChain("burger", "fries", { display: true });

// findShortestWordChain("dog", "chart", { display: true });
