const express = require("express");

const mongoose = require("mongoose");
const Item = require("./itemModel"); 
const app = express();

const PORT = 5000;


app.use(express.json()); // Middleware to parse JSON request body

const MONGODB_URL =
  "mongodb+srv://Steev:Steev@cluster0.uf3jdv0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(MONGODB_URL).then (()=> {
  console.log("MongoDB connected successfully")
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
).catch((error) => {
  console.error("MongoDB connection error:", error);
}); 


// add found item
app.post("/add-item", async (req, res) => {

    const { itemName, description, locationFound, dateFound, claimed } = req.body;

    if (!itemName || !description || !locationFound || !dateFound || claimed === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
const newItem = new Item({
    itemName,
    description,
    locationFound,
    dateFound,
    claimed
  });

  await newItem.save()

      res.status(201).json({ message: "Item added successfully", newItem })
    })



// View all unclaimed items
app.get("/unclaimed-items/", async (req, res) => {

    const { claimed } = req.query;
    
      const items = await Item.find({ claimed: false });
      res.json(items);

      if (!items) {
        return res.status(404).json({ message: "No unclaimed items found" });
      }
    res.status(200).json(items);        
    })
  
//View one item by ID
  app.get("/one-item/:id", async (req, res) => {

    const { id } = req.params

    const item = await Item.findById(id);
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json({
        message: "Item found successfully",
        item
      });
    }   
  );


// View all items
// This route will return all items, regardless of their claimed status
  app.get("/items", async (req, res) => {

      const items = await Item.find(); // You can add filters later if needed
      if (!items) {
        return res.status(404).json({ message: "No items available" });
      }
      res.status(200).json(items);
    
  });
  


//update claimed status
// This route will update the claimed status of an item by its ID
app.patch("/update-item/:id", async (req, res) => {
    const { id } = req.params;
    const { claimed } = req.body;

    if (claimed === undefined) {
      return res.status(400).json({ message: "Claimed status is required" });
    }

    const updatedItem = await Item.findByIdAndUpdate(id, { claimed }, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item updated successfully",
      updatedItem
    });
  } );
  

  // Delete an item
// This route will delete an item by its ID
app.delete("/delete-item/:id", async (req, res) => {
    const { id } = req.params;

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item deleted successfully",
      deletedItem
    });
  } );