const { MongoClient } = require("mongodb");

// Replace <cluster-url> with your cluster's host, e.g., "cluster0.mongodb.net"
// Ensure special characters in the password are URL-encoded. For example, "!" becomes "%21".

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    

    const database= client.db("Users");

    const collection = database.collection("user_db");

    const doc = { name: "Aaryan Shukla", posture: "curved"};

    const result = await collection.insertOne(doc);


    console.log(
        `A document was inserted with the _id: ${result.insertedId}`,
     );



  } catch (err) {
    console.error("An error occurred while connecting to MongoDB:", err);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}
run().catch(console.dir);
