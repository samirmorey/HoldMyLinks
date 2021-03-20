const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then((conn) => {
    console.log("Database Successfully connected " + conn.connections[0].host);
  })
  .catch((err) => console.log(err));
