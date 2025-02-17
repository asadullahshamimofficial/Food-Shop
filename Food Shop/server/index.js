const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId} = require("mongodb");

app.use(cors({origin: ['http://localhost:5173', 'https://food-shop-aus.web.app'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

const uri = `${process.env.DB_URI}`;

const secretKey = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Admins only!" });
  }
  next();
};

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log( "Pinged your deployment. You successfully connected to MongoDB!");

    const foodsCollection = client.db("foodShop").collection("foods");
    const foodApplicationCollection = client.db("foodShop").collection("food_application");
    const usersCollection = client.db("foodShop").collection("users");

    // auth related APIs
    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });

      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })
        .send({ success: true })
    });

    app.get("/foods", async (req, res) => {
      const email = req.query.email;
      const search = req.query.search || "";
      let query = {};
      if (email) {
        query = { owner_email: email };
      }
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
      const cursor = foodsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/foods/:id', async (req, res) => {
      const { id } = req.params;
      const food = await foodsCollection.findOne({ _id: new ObjectId(id) });
      if (food) {
        res.json(food);
      } else {
        res.status(404).send("Food not found");
      }
    });

    app.post('/foods/:id/purchase', async (req, res) => {
      const { id } = req.params;
      const result = await foodsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { purchaseCount: 1 } } // Increment purchase count by 1
      );
      if (result.modifiedCount > 0) {
        res.status(200).send("Purchase successful");
      } else {
        res.status(400).send("Failed to update purchase count");
      }
    });

    app.post('/foods', async (req, res) => {
      const newFood = req.body;
      try {
        const result = await foodsCollection.insertOne(newFood);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: 'Error adding food', error: err.message });
      }
    });

    app.get("/food-application", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { applicant_email: email };
    
      if (req.user.email !== req.query.email) {
        return res.status(403).send({ message: 'Forbidden access' });
      }
    
      const result = await foodApplicationCollection.find(query).toArray();
      for (const application of result) {
        const query1 = { _id: new ObjectId(application.food_id) };
        const food = await foodsCollection.findOne(query1);
        if (food) {
          application.name = food.name;
          application.origin = food.origin;
          application.owner_email = food.owner_email;
          application.food_owner = food.food_owner;
          application.image = food.image;
        }
      }
      res.send(result);
    });

    app.get("/food-application/foods/:food_id", async (req, res) => {
      const foodId = req.params.food_id;
      const query = {food_id: foodId};
      const result = await foodApplicationCollection.find(query).toArray();
      res.send(result);
    });
  
    app.post("/food-application", async (req, res) => {
      const application = req.body;
      const result = await foodApplicationCollection.insertOne(application);
  
      const id = application.food_id;
      const query = {_id: new ObjectId(id)};
      const food = await foodsCollection.findOne(query);
      let newCount = 0;
      if (food.applicationCount) {
        newCount = food.applicationCount + 1;
      } else {
        newCount = 1;
      }
  
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: {
          applicationCount: newCount,
        },
      };
  
      const updateResult = await foodsCollection.updateOne(filter, updatedDoc);
  
      res.send(result);
    });
  
    app.patch("/food-application/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: {
          status: data.status,
        },
      };
      const result = await foodApplicationCollection.updateOne(
        filter,
        updatedDoc
      );
      res.send(result);
    });

    app.post("/purchase", async (req, res) => {
      const { foodId, buyerEmail } = req.body;
      const food = await foodsCollection.findOne({ _id: new ObjectId(foodId) });
    
      if (!food) {
        return res.status(404).send({ message: "Food not found!" });
      }
    
      // Check if the buyer is the same as the food owner
      if (food.food_owner === buyerEmail) {
        return res
          .status(403)
          .send({ message: "You cannot purchase your own food item!" });
      }
    
      // Proceed to save the purchase data
      const result = await foodApplicationCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/gallery", async (req, res) => {
      const { page = 1, limit = 12 } = req.query; // Pagination
      const skip = (page - 1) * limit;
    
      try {
        const galleryCollection = client.db("foodShop").collection("gallery");
        const galleryItems = await galleryCollection
          .find({})
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();
        res.send(galleryItems);
      } catch (err) {
        res.status(500).send({ message: "Error fetching gallery data", error: err.message });
      }
    });

    app.get("/orders", async (req, res) => {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
    
      try {
        const orders = await foodApplicationCollection.find({ buyerEmail: email }).toArray();
        res.status(200).json(orders);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch orders" });
      }
    });

    app.delete("/orders/:id", async (req, res) => {
      const { id } = req.params;
    
      try {
        const result = await foodApplicationCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Order deleted successfully" });
        } else {
          res.status(404).json({ message: "Order not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete order" });
      }
    });

    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await usersCollection.findOne({ email, password });
      if (!user) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      // Create JWT token
      const token = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.send({ message: "Login successful", user });
    });

    app.get("/private-route", verifyToken, (req, res) => {
      res.send({ message: "This is a protected route", user: req.user });
    });    

    app.get("/admin-route", verifyToken, verifyAdmin, (req, res) => {
      res.send({ message: "Welcome Admin!" });
    });

    app.post("/social-login", async (req, res) => {
      const { tokenId } = req.body;
    
      // Verify the Google token (use Google SDK)
      const payload = await verifyGoogleToken(tokenId); // Replace with your implementation
      const email = payload.email;
    
      // Generate a JWT token for the user
      const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });
    
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    
      res.send({ message: "Social login successful", user: payload });
    });

  } finally {}
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome! In Our Food Shop Server");
});

app.listen(port, () => {
  console.log(`Food is waiting at: ${port}`);
});