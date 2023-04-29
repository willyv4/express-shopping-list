const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/items", (req, res, next) => {
  try {
    const allItems = items;
    if (allItems.length === 0) {
      throw new ExpressError("no items in cart", 404);
    }
    return res.status(200).json({ items: allItems });
  } catch (e) {
    return next(e);
  }
});

router.get("/items/:name", (req, res, next) => {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (foundItem === undefined) {
      throw new ExpressError("item not found", 404);
    }
    return res.json({ items: foundItem });
  } catch (e) {
    return next(e);
  }
});

router.post("/items", (req, res, next) => {
  try {
    if (!req.body.name) throw new ExpressError("Data is required", 400);
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (e) {
    return next(e);
  }
});

router.patch("/items/:name", function (req, res) {
  const foundItem = items.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("item not found", 404);
  }
  foundItem.name = req.body.name;
  foundItem.price = req.body.price;
  res.json({ updated: foundItem });
});

router.delete("/items/:name", function (req, res) {
  const foundItem = items.findIndex((item) => item.name === req.params.name);
  if (foundItem === -1) {
    throw new ExpressError("item not found", 404);
  }
  items.splice(foundItem, 1);
  res.json({ message: "Deleted" });
});

module.exports = router;
