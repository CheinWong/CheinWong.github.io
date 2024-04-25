import { TwitterApi } from "twitter-api-v2";
import { promises as fs } from "fs";
import { readFile } from "fs/promises";
import Sentiment from "sentiment";

const client_auth1 = new TwitterApi({
  appKey: "Gis09wVQpwiYv47P9DA6wUoVv",
  appSecret: "sKJ0G5iVQyQnwd5F4dWNJeYPTGlZI15oIVqd42RMaqA0e3VSCa",
  accessToken: "1623503130477613057-XtIoh25vZd3DiSclNSKSRKWraNrmKR",
  accessSecret: "tD5cZgBup9tPoOCn7ifU2i5ZugzZc5xrOCjeAW0QUnExz",
});

const client_app = new TwitterApi(
  "AAAAAAAAAAAAAAAAAAAAAJCrtAEAAAAAajVqfCcNKj6aq46h8VluqDTW6YM%3DchU70n0I5JoDKh3capXD0aB9H8Kg0v1IF2tMhyIDh0aNKaOBTO"
);

export async function analysis_by_topic(socket, keywords) {
  const tweet_volume_by_hour = await client_app.v2.tweetCountRecent(keywords, {
    granularity: "hour",
  });
  // console.log(tweet_volume_by_hour.data);

  // Write JSON string to a file
  await write_to_file(
    tweet_volume_by_hour.data,
    "public/data/tweet_volume_by_hour.json"
  );

  console.log("SEARCH VOLUME DONE");

  const most_recent_tweets = await client_app.v2.search(keywords, {
    "tweet.fields": "public_metrics,lang",
    max_results: 50,
  });

  // console.log(most_recent_tweets.data.data);
  const most_recent_tweets_text = most_recent_tweets.data.data.map((item) => {
    if (item.lang == "en") {
      return item.text;
    }
    return "";
  });
  // console.log(most_recent_tweets_text);

  // // Write JSON string to a file
  await write_to_file(most_recent_tweets_text, "public/data/word_cloud.json");

  console.log("WORD CLOUD DONE");

  // Read the file asynchronously
  (async () => {
    try {
      // Read the file asynchronously
      const jsonData = await readFile("public/data/word_cloud.json", "utf8");
      // Parse the JSON data
      const data = JSON.parse(jsonData);
      // console.log("JSON data:", data);

      let pos_sentiment_count = 0;
      let neg_sentiment_count = 0;
      let neu_sentiment_count = 0;
      let tweets_count = 0;

      const sentiment = new Sentiment();
      data.forEach((tweets) => {
        tweets_count++;
        const sentiments_result = sentiment.analyze(tweets);
        // console.log(sentiments_result.score);
        if (sentiments_result.score == 0) {
          neu_sentiment_count++;
        } else if (sentiments_result.score > 0) {
          pos_sentiment_count++;
        } else if (sentiments_result.score < 0) {
          neg_sentiment_count++;
        }
      });

      let sentiments_data = [
        { label: "Positive", value: 0 },
        { label: "Neutral", value: 0 },
        { label: "Negative", value: 0 },
      ];
      sentiments_data[0].value = pos_sentiment_count / tweets_count;
      sentiments_data[1].value = neu_sentiment_count / tweets_count;
      sentiments_data[2].value = neg_sentiment_count / tweets_count;

      // console.log(sentiments_data, tweets_count);

      // Write JSON string to a file
      await write_to_file(sentiments_data, "public/data/sentiments.json");

      console.log("SENTIMENTS DONE");

      socket.emit("process_analysis_by_topic_data");
      console.log("SOCKET EMIT SENT");
    } catch (err) {
      console.error("Error reading file:", err);
    }
  })();
}

export async function analysis_by_user(socket, username) {
  const user_details = await client_app.v2.userByUsername(username);
  const username_id = user_details.data.id;
  const tweets_of_user = await client_app.v2.userTimeline(username_id, {
    exclude: "replies",
    "tweet.fields": "public_metrics",
    max_results: 10,
  });

  let user_tweets = [];
  for (const tweet_details of tweets_of_user) {
    user_tweets.push(tweet_details);
  }
  // console.log(user_tweets);

  // Write JSON string to a file
  await write_to_file(user_tweets, "public/data/tweets_by_users.json");
  console.log("USER TWEETS DONE");

  let tweets_like_by_users_details = [];
  await Promise.all(
    user_tweets.map(async function (arr, index) {
      // console.log(index);
      const usersPaginated = await client_app.v2.tweetLikedBy(arr.id, {
        "user.fields": "location,public_metrics",
        asPaginator: true,
      });

      for await (const user of usersPaginated) {
        tweets_like_by_users_details.push(user);
      }
    })
  );

  // Write JSON string to a file
  await write_to_file(
    tweets_like_by_users_details,
    "public/data/liked_users_details.json"
  );
  console.log("LIKE USERS DONE");

  const readFileAsync = async () => {
    try {
      // Read the file asynchronously
      const jsonData = await readFile(
        "public/data/liked_users_details.json",
        "utf8"
      );
      // Parse the JSON data
      tweets_like_by_users_details = JSON.parse(jsonData);
      // console.log("JSON data:", tweets_like_by_users_details);
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };

  (async () => {
    await readFileAsync(); // Wait for the async operation to complete
    // console.log("JSON data:", tweets_like_by_users_details);

    let user_lat_lon = [];
    await Promise.all(
      tweets_like_by_users_details.map(async function (arr, index) {
        if (index < 20) {
          if (arr.location != null) {
            console.log(arr.location);
            var encodedAddress = encodeURIComponent(arr.location);
            var url = `https://nominatim.openstreetmap.org/search.php?q=${encodedAddress}&format=jsonv2`;

            await fetch(url)
              .then(function (response) {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then(function (data) {
                if (data.length > 0) {
                  let result = {};
                  var lat = data[0].lat;
                  var lon = data[0].lon;
                  // console.log(lat, lon);
                  user_lat_lon.push({ lat: lat, lon: lon });
                } else {
                  console.log("No results found for the address:", address);
                }
              })
              .catch(function (error) {
                console.error("Error fetching geocoding data:", error);
              });
          }
        }
      })
    );

    // Write JSON string to a file
    await write_to_file(user_lat_lon, "public/data/liked_users_latlon.json");
    console.log("LIKE USER LAT LON DONE");

    socket.emit("process_analysis_by_user_data");
    console.log("SOCKET EMIT SENT");
  })();

}

async function write_to_file(data, path) {
  const jsonString1 = JSON.stringify(data, null, 2);
  try {
    await fs.writeFile(path, jsonString1);
    console.log("Data has been written to file");
  } catch (err) {
    console.error("Error writing data to file:", err);
  }
}
