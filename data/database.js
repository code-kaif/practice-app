import mongoose from "mongoose";
export function dbConnection() {
  mongoose
    .connect(process.env.DB_CONNECTION_URL, {
      dbName: "myapi",
    })
    .then(() => console.log("Mongo Connected"))
    .catch((err) => console.log(err));
}
