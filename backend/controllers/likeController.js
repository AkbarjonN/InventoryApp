export const toggleLike = async (req, res) => {
    try {
      const { postId } = req.body;
  
      const post = await req.models.Post.findByPk(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      const existingLike = await req.models.Like.findOne({
        where: { postId, userId: req.user.id },
      });
  
      if (existingLike) {
        await existingLike.destroy();
        req.io.to(`post_${postId}`).emit("like_removed", {
          postId,
          userId: req.user.id,
        });
  
        return res.json({ liked: false });
      } else {
        await req.models.Like.create({ postId, userId: req.user.id });
  
        req.io.to(`post_${postId}`).emit("like_added", {
          postId,
          userId: req.user.id,
        });
  
        return res.json({ liked: true });
      }
    } catch (error) {
      console.error("❌ Error toggling like:", error);
      res.status(500).json({ message: "Error toggling like" });
    }
  };
  
  export const getLikes = async (req, res) => {
    try {
      const likes = await req.models.Like.findAll({
        where: { postId: req.params.postId },
        include: [{ model: req.models.User, attributes: ["id", "username"] }],
      });
  
      res.json(likes);
    } catch (error) {
      console.error("❌ Error fetching likes:", error);
      res.status(500).json({ message: "Error fetching likes" });
    }
  };
  