const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const uploadController = require('./controllers/uploadController')


const PORT = process.env.PORT;
// backend port 5000 frontend port 3000

const app = express();
app.use('/images',express.static('public/images'))
// app.use(cors());

// enable cors
app.use(
  cors({
    origin: "https://tubular-bunny-9e107b.netlify.app",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/post',postRouter);
app.use('/comment',commentRouter);
app.use('/upload',uploadController);

// mongoose.set('strictQuery',false)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MONGODB");

    // start the server
    app.listen(PORT, () => {
      console.log(`Server running on the port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to mongodb", err);
  });
