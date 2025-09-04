
export const createInventory = async (req, res) => {
  try {
    const { name, description, tags, isPublic } = req.body;

    const inventory = await req.models.Inventory.create({
      name,
      description,
      tags: tags || null,
      isPublic: isPublic ?? false,
      userId: req.user.id,
    });

    res.status(201).json(inventory);
  } catch (error) {
    console.error("❌ Error creating inventory:", error);
    res.status(500).json({ message: "Error creating inventory" });
  }
};

export const getInventories = async (req, res) => {
  try {
    const inventories = await req.models.Inventory.findAll({
      include: [{ model: req.models.User, attributes: ["id", "username", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(inventories);
  } catch (error) {
    console.error("❌ Error fetching inventories:", error);
    res.status(500).json({ message: "Error fetching inventories" });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const inventory = await req.models.Inventory.findByPk(req.params.id, {
      include: [
        { model: req.models.User, attributes: ["id", "username"] },
        { model: req.models.Item },
      ],
    });

    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    res.json(inventory);
  } catch (error) {
    console.error("❌ Error fetching inventory:", error);
    res.status(500).json({ message: "Error fetching inventory" });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const inventory = await req.models.Inventory.findByPk(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    if (inventory.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { name, description, tags, isPublic } = req.body;

    await inventory.update({
      name,
      description,
      tags: tags || null,
      isPublic: isPublic ?? inventory.isPublic,
    });

    res.json(inventory);
  } catch (error) {
    console.error("❌ Error updating inventory:", error);
    res.status(500).json({ message: "Error updating inventory" });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const inventory = await req.models.Inventory.findByPk(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    if (inventory.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await inventory.destroy();
    res.json({ message: "Inventory deleted" });
  } catch (error) {
    console.error("❌ Error deleting inventory:", error);
    res.status(500).json({ message: "Error deleting inventory" });
  }
};
