export const createPost = async (req, res) => {
  try {
    const { content, inventoryId } = req.body;

    if (!content || !inventoryId) {
      return res.status(400).json({ message: "Content and inventoryId required" });
    }

    const post = await req.models.Post.create({
      content,
      inventoryId,
      userId: req.user.id,
    });
    req.io.to(`inventory_${inventoryId}`).emit("post_created", post);

    res.status(201).json(post);
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { inventoryId } = req.query;
    const where = inventoryId ? { inventoryId } : {};

    const posts = await req.models.Post.findAll({
      where,
      include: [
        { model: req.models.User, attributes: ["id", "username", "role"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await req.models.Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.destroy();
    req.io.to(`inventory_${post.inventoryId}`).emit("post_deleted", {
      postId: post.id,
    });

    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
};
