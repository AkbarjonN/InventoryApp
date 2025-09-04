export const setFieldValue = async (req, res) => {
    try {
      const { itemId, fieldId, value } = req.body;
  
      const item = await req.models.Item.findByPk(itemId);
      if (!item) return res.status(404).json({ message: "Item not found" });
  
      const field = await req.models.Field.findByPk(fieldId);
      if (!field) return res.status(404).json({ message: "Field not found" });

      let fieldValue = await req.models.FieldValue.findOne({
        where: { itemId, fieldId },
      });
  
      if (fieldValue) {
        await fieldValue.update({ value });
      } else {
        fieldValue = await req.models.FieldValue.create({ itemId, fieldId, value });
      }
  
      res.json(fieldValue);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error setting field value" });
    }
  };
  
  export const getItemFieldValues = async (req, res) => {
    try {
      const values = await req.models.FieldValue.findAll({
        where: { itemId: req.params.itemId },
        include: [{ model: req.models.Field }],
      });
  
      res.json(values);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching field values" });
    }
  };
  