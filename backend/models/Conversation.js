import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true
    },
    moduleId: { 
        type: String,
        required: false, 
    },
    topicId: {
      type: String,
      required: true
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

conversationSchema.index(
    { userId: 1, roadmapId: 1, topicId: 1 }, 
    { unique: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
