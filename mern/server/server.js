import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from 'morgan';
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

// 1. Logging middleware (e.g., Morgan) - often first to log all requests
app.use(morgan('dev'));

// 2. Security/CORS middleware
app.use(cors());

// 3. Body parsers - essential for req.body
app.use(express.json()); // For JSON request bodies
app.use(express.urlencoded({ extended: true })); // For URL-encoded request bodies

// 4. Cookie parsers (if using cookies)
// app.use(cookieParser());

// 5. Session middleware (if using sessions)
// app.use(session({...}));

// 6. Static files (if serving any) - can be early to serve assets quickly
// app.use(express.static('public'));

// 7. Authentication middleware (e.g., Passport.js) - before protected routes
// app.use(passport.initialize());
// app.use(passport.session()); // If using sessions

// Mongoose Connection in app.js
async function connectDB() {
  try {
    const mongoUri = process.env.ATLAS_URI || "";
    if (!mongoUri) {
      console.error("ATLAS_URI is not defined!");
      process.exit(1);
    }
    await mongoose.connect(mongoUri); // Simplified for Mongoose 6+
    console.log("MongoDB connected with Mongoose!");

    // Set up Mongoose event listeners here if desired
    mongoose.connection.on('error', err => console.error(`Mongoose connection error: ${err}`));

  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDB(); // Call the connection function when the app starts

// 8. Custom route handlers
app.use("/record", records);

// 9. Catch-all for 404 Not Found (if no route matched)
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// 10. Error handling middleware - ALWAYS LAST
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).send('Something broke!');
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
