const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer in-memory storage for handling multipart form data (images)
const upload = multer({ storage: multer.memoryStorage() });

// In-memory mock database
let categories = [
  {
    categoryId: 1,
    categoryName: "Women",
    description: "Women's premium streetwear apparel and dresses",
    imagePath: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=400&auto=format&fit=crop",
    subCategoryIds: JSON.stringify([
      { id: "1-dresses", name: "Dresses", description: "Elegant dresses for women", imageUrl: "", isActive: true, categoryId: "1" },
      { id: "1-tops", name: "Tops", description: "Stylish tops and blouses", imageUrl: "", isActive: true, categoryId: "1" }
    ]),
    isActive: true,
    isDeleted: false
  },
  {
    categoryId: 2,
    categoryName: "Men",
    description: "Men's tailored outerwear and street fashion shirts",
    imagePath: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=400&auto=format&fit=crop",
    subCategoryIds: JSON.stringify([
      { id: "2-shirts", name: "Shirts", description: "Tailored shirts", imageUrl: "", isActive: true, categoryId: "2" },
      { id: "2-outerwear", name: "Outerwear", description: "Premium jackets", imageUrl: "", isActive: true, categoryId: "2" }
    ]),
    isActive: true,
    isDeleted: false
  },
  {
    categoryId: 3,
    categoryName: "Unisex",
    description: "Genderless curations and custom bags",
    imagePath: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop",
    subCategoryIds: JSON.stringify([
      { id: "3-bags", name: "Bags", description: "Versatile accessories", imageUrl: "", isActive: true, categoryId: "3" }
    ]),
    isActive: true,
    isDeleted: false
  }
];

let nextId = 4;

// GET: Fetch all categories (excluding soft-deleted ones)
app.get("/dripdoggy/api/admin/categories", (req, res) => {
  const activeCats = categories.filter(c => !c.isDeleted);
  res.json(activeCats);
});

// GET: Fetch category by ID
app.get("/dripdoggy/api/admin/categories/:id", (req, res) => {
  const cat = categories.find(c => c.categoryId === Number(req.params.id) && !c.isDeleted);
  if (cat) {
    res.json(cat);
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

// POST: Create a new Category
app.post("/dripdoggy/api/admin/categories", upload.single("image"), (req, res) => {
  const { categoryName, description, subCategoryIds } = req.body;
  
  // Create mock image preview string if file uploaded
  let imagePath = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop";
  if (req.file) {
    imagePath = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  }

  const newCat = {
    categoryId: nextId++,
    categoryName: categoryName || "New Category",
    description: description || "",
    imagePath,
    subCategoryIds: subCategoryIds || "",
    isActive: true,
    isDeleted: false
  };

  categories.push(newCat);
  res.status(201).json(newCat);
});

// PUT: Update an existing Category
app.put("/dripdoggy/api/admin/categories/:id", upload.single("image"), (req, res) => {
  const id = Number(req.params.id);
  const index = categories.findIndex(c => c.categoryId === id && !c.isDeleted);

  if (index !== -1) {
    const { categoryName, description, subCategoryIds, isActive } = req.body;

    if (categoryName !== undefined) categories[index].categoryName = categoryName;
    if (description !== undefined) categories[index].description = description;
    if (subCategoryIds !== undefined) categories[index].subCategoryIds = subCategoryIds;
    if (isActive !== undefined) categories[index].isActive = (isActive === "true" || isActive === true);

    if (req.file) {
      categories[index].imagePath = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    res.json(categories[index]);
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

// PATCH: Toggle category active state
app.patch("/dripdoggy/api/admin/categories/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = categories.findIndex(c => c.categoryId === id && !c.isDeleted);

  if (index !== -1) {
    categories[index].isActive = !categories[index].isActive;
    res.json(categories[index]);
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

// DELETE: Soft delete a category
app.delete("/dripdoggy/api/admin/categories/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = categories.findIndex(c => c.categoryId === id && !c.isDeleted);

  if (index !== -1) {
    categories[index].isDeleted = true;
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`[DripDoggy Mock Backend] Running on http://localhost:${PORT}`);
});
