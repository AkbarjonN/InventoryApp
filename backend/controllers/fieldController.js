export const createField = async (req, res) => {
    try {
      const { name, type, inventoryId } = req.body;
  
      const inventory = await req.models.Inventory.findByPk(inventoryId);
      if (!inventory) return res.status(404).json({ message: "Inventory not found" });
  
      const field = await req.models.Field.create({
        name,
        type, 
        inventoryId,
      });
  
      res.status(201).json(field);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating field" });
    }
  };
  
  export const getFields = async (req, res) => {
    try {
      const fields = await req.models.Field.findAll({
        where: { inventoryId: req.params.inventoryId },
      });
  
      res.json(fields);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching fields" });
    }
  };
  
  export const deleteField = async (req, res) => {
    try {
      const field = await req.models.Field.findByPk(req.params.id);
      if (!field) return res.status(404).json({ message: "Field not found" });
  
      await field.destroy();
      res.json({ message: "Field deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting field" });
    }
  };
  