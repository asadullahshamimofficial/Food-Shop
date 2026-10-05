const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
require("dotenv").config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 5000;
const secretKey = (process.env.ACCESS_TOKEN_SECRET || "").trim();
const SALT_ROUNDS = 10;

app.use(cors({ origin: ["http://localhost:5173", "https://food-shop-aus.web.app"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ─── MongoDB Connection Cache (Vercel serverless pattern) ─────────────────────
const uri = (process.env.DB_URI || process.env.MONGODB_URI || "").trim();
let cachedClient = null;

async function getDB() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  cachedClient = client;
  return client;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: "Unauthorized access" });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Forbidden access" });
    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).send({ message: "Admins only!" });
  next();
};

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.send("Welcome! In Our Food Shop Server");
});

// Issue JWT cookie
app.post("/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, secretKey, { expiresIn: "10h" });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .send({ success: true });
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    if (!email || !password) return res.status(400).send({ message: "Email and password are required" });

    const client = await getDB();
    const usersCollection = client.db("foodShop").collection("users");

    const existing = await usersCollection.findOne({ email });
    if (existing) return res.status(409).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await usersCollection.insertOne({ email, password: hashedPassword, ...rest });
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Registration failed", error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await getDB();
    const usersCollection = client.db("foodShop").collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).send({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send({ message: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, { expiresIn: "10h" });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .send({ message: "Login successful", user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).send({ message: "Login failed", error: err.message });
  }
});

// ─── Foods ────────────────────────────────────────────────────────────────────

app.get("/foods", async (req, res) => {
  try {
    const client = await getDB();
    const foodsCollection = client.db("foodShop").collection("foods");

    const email = req.query.email;
    const search = req.query.search || "";
    let query = {};
    if (email) query = { owner_email: email };
    if (search) query.name = { $regex: search, $options: "i" };

    const result = await foodsCollection.find(query).toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch foods", error: err.message });
  }
});

app.get("/foods/:id", async (req, res) => {
  try {
    const client = await getDB();
    const foodsCollection = client.db("foodShop").collection("foods");

    const food = await foodsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (food) res.json(food);
    else res.status(404).send("Food not found");
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch food", error: err.message });
  }
});

app.post("/foods/:id/purchase", async (req, res) => {
  try {
    const client = await getDB();
    const foodsCollection = client.db("foodShop").collection("foods");

    const result = await foodsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { purchaseCount: 1 } }
    );
    if (result.modifiedCount > 0) res.status(200).send("Purchase successful");
    else res.status(400).send("Failed to update purchase count");
  } catch (err) {
    res.status(500).send({ message: "Error", error: err.message });
  }
});

app.post("/foods", verifyToken, async (req, res) => {
  try {
    const client = await getDB();
    const foodsCollection = client.db("foodShop").collection("foods");
    const result = await foodsCollection.insertOne(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Error adding food", error: err.message });
  }
});

app.patch("/foods/:id", async (req, res) => {
  try {
    const client = await getDB();
    const foodsCollection = client.db("foodShop").collection("foods");

    const { quantity } = req.body;

    const result = await foodsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { quantity: Number(quantity) } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Food not found!" });
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({
      message: "Failed to update food quantity",
      error: err.message,
    });
  }
});

// ─── Food Applications ────────────────────────────────────────────────────────

app.get("/food-application", verifyToken, async (req, res) => {
  try {
    const client = await getDB();
    const foodsCollection = client.db("foodShop").collection("foods");
    const foodApplicationCollection = client.db("foodShop").collection("food_application");

    const email = req.query.email;
    if (req.user.email !== email) return res.status(403).send({ message: "Forbidden access" });

    const result = await foodApplicationCollection.find({ applicant_email: email }).toArray();
    for (const application of result) {
      const food = await foodsCollection.findOne({ _id: new ObjectId(application.food_id) });
      if (food) {
        application.name = food.name;
        application.origin = food.origin;
        application.owner_email = food.owner_email;
        application.food_owner = food.food_owner;
        application.image = food.image;
      }
    }
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Error", error: err.message });
  }
});

app.get("/food-application/foods/:food_id", async (req, res) => {
  try {
    const client = await getDB();
    const foodApplicationCollection = client.db("foodShop").collection("food_application");
    const result = await foodApplicationCollection.find({ food_id: req.params.food_id }).toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Error", error: err.message });
  }
});

app.post("/food-application", verifyToken, async (req, res) => {
  try {
    const client = await getDB();
    const foodsCollection = client.db("foodShop").collection("foods");
    const foodApplicationCollection = client.db("foodShop").collection("food_application");

    const application = req.body;
    const result = await foodApplicationCollection.insertOne(application);

    const food = await foodsCollection.findOne({ _id: new ObjectId(application.food_id) });
    const newCount = food?.applicationCount ? food.applicationCount + 1 : 1;
    await foodsCollection.updateOne(
      { _id: new ObjectId(application.food_id) },
      { $set: { applicationCount: newCount } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Error", error: err.message });
  }
});

app.patch("/food-application/:id", verifyToken, async (req, res) => {
  try {
    const client = await getDB();
    const foodApplicationCollection = client.db("foodShop").collection("food_application");
    const result = await foodApplicationCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: req.body.status } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Error", error: err.message });
  }
});

// ─── Purchase ─────────────────────────────────────────────────────────────────

app.post("/purchase", verifyToken, async (req, res) => {
  try {
    const client = await getDB();
    const foodsCollection = client.db("foodShop").collection("foods");
    const foodApplicationCollection = client.db("foodShop").collection("food_application");

    const { foodId, buyerEmail } = req.body;
    const food = await foodsCollection.findOne({ _id: new ObjectId(foodId) });
    if (!food) return res.status(404).send({ message: "Food not found!" });
    if (food.owner_email === buyerEmail) return res.status(403).send({ message: "You cannot purchase your own food item!" });

    const result = await foodApplicationCollection.insertOne(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Purchase failed", error: err.message });
  }
});

// ─── Orders ───────────────────────────────────────────────────────────────────

app.get("/orders", verifyToken, async (req, res) => {
  try {
    const client = await getDB();
    const foodApplicationCollection = client.db("foodShop").collection("food_application");

    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (req.user.email !== email) return res.status(403).json({ message: "Forbidden access" });

    const orders = await foodApplicationCollection.find({ buyerEmail: email }).toArray();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

app.delete("/orders/:id", verifyToken, async (req, res) => {
  try {
    const client = await getDB();
    const foodApplicationCollection = client.db("foodShop").collection("food_application");

    const result = await foodApplicationCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 1) res.status(200).json({ message: "Order deleted successfully" });
    else res.status(404).json({ message: "Order not found" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
});

// ─── Gallery ──────────────────────────────────────────────────────────────────

app.get("/gallery", async (req, res) => {
  try {
    const client = await getDB();
    const galleryCollection = client.db("foodShop").collection("gallery");

    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    const galleryItems = await galleryCollection.find({}).skip(skip).limit(parseInt(limit)).toArray();
    res.send(galleryItems);
  } catch (err) {
    res.status(500).send({ message: "Error fetching gallery data", error: err.message });
  }
});

// ─── Protected / Admin routes ─────────────────────────────────────────────────

app.get("/private-route", verifyToken, (req, res) => {
  res.send({ message: "This is a protected route", user: req.user });
});

app.get("/admin-route", verifyToken, verifyAdmin, (req, res) => {
  res.send({ message: "Welcome Admin!" });
});

// ─── Start (local only — Vercel ignores this) ─────────────────────────────────
app.listen(port, () => {
  console.log(`Food is waiting at: ${port}`);
});

module.exports = app;