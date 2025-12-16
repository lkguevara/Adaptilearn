import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  name: String,
  url: String,
});

const topicSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: String,
  summary: String,
  estimatedTime: String,
  subtopics: [String],
//   completed: {
//     type: Boolean,
//     default: false
//   },
//   position: {
//     x: Number,
//     y: Number
//   },
  resources: [resourceSchema]
});

const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: String,
  description: String,
  topics: [topicSchema]
});

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    level: String,
    estimatedTime: String,

    modules: [moduleSchema],

    connections: [
        {
            from: { type: String, required: true },
            to: { type: String, required: true }
        }
    ],
    
    metadata: {
        source: String,
        dateGenerated: String
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
