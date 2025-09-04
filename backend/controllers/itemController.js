
export const createItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const { inventoryId } = req.params;
    const inventory = await req.models.Inventory.findByPk(inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    const item = await req.models.Item.create({
      name,
      quantity,
      inventoryId,
      createdBy: req.user.id,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("❌ Error creating item:", error);
    res.status(500).json({ message: "Error creating item" });
  }
};

export const getItems = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const items = await req.models.Item.findAll({
      where: { inventoryId },
      order: [["createdAt", "DESC"]],
    });

    res.json(items);
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id, inventoryId } = req.params;

    const item = await req.models.Item.findOne({
      where: { id, inventoryId },
    });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    console.error("❌ Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
};
export const deleteItem = async (req, res) => {
  try {
    const { id, inventoryId } = req.params;

    const item = await req.models.Item.findOne({
      where: { id, inventoryId },
    });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.destroy();
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item" });
  }
};
