function getRandomColor() {
  // Generate random values for red, green, and blue components
  const r = Math.floor(Math.random() * 256); // Random integer between 0 and 255
  const g = Math.floor(Math.random() * 256); // Random integer between 0 and 255
  const b = Math.floor(Math.random() * 256); // Random integer between 0 and 255

  // Construct the hexadecimal color code
  const color =
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0");

  return color;
}

function sanitize_text(text) {
  // Remove Twitter handles (@username)
  text = text.replace(/@\w+/g, "");

  // Remove hashtags (#hashtag)
  text = text.replace(/#\w+/g, "");

  // Remove URLs
  text = text.replace(/https?:\/\/\S+/g, "");

  // Remove numeric characters
  text = text.replace(/\d+/g, "");

  // Remove non-alphanumeric characters and punctuation
  text = text.replace(/[^\w\s]/g, "");

  // Convert to lowercase
  text = text.toLowerCase();

  return text;
}

function count_word_repetition(text) {
  // Convert text to lowercase and split into words
  const words = text.toLowerCase().match(/\b\w+\b/g);

  // Define syncategorematic words to exclude
  const syncategorematicWords = [
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "to",
    "for",
    "with",
    "rt",
    "it",
    "just",
    "is",
    "in",
    "if",
    "like",
    "your",
    "as",
    "i",
    "you",
    "my",
    "was",
    "of",
    "by",
    "its",
    "ig",
    "on",
    "are",
    "has",
    "our",
    "go",
    "at",
    "those",
    "will",
    "all",
    "now",
  ];

  // Initialize an empty object to store word counts
  const wordCounts = {};

  // Iterate over each word
  words.forEach((word) => {
    // Check if the word is not a syncategorematic word
    if (!syncategorematicWords.includes(word)) {
      // If the word already exists in the wordCounts object, increment its count
      if (wordCounts[word]) {
        wordCounts[word]++;
      } else {
        // If the word doesn't exist, initialize its count to 1
        wordCounts[word] = 1;
      }
    }
  });
  return wordCounts;
}

async function fetchJsonFromFile(filename) {
  try {
    // Fetch JSON data from the file
    const response = await fetch(filename);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch JSON");
    }

    // Parse JSON data
    const jsonData = await response.json();

    // Return parsed JSON data
    return jsonData;
  } catch (error) {
    console.error("Error fetching JSON:", error);
    throw error; // Re-throw the error for handling at a higher level
  }
}
