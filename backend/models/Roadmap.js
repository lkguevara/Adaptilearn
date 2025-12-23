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
  resources: [resourceSchema]
});

const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: String,
  description: String,
  topics: [topicSchema]
});

// Schema para el contador de IDs secuenciales
const counterSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  value: { type: Number, default: 0 }
});

const roadmapSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  },
  {
    timestamps: true
  }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
const Counter = mongoose.model("Counter", counterSchema);

export { Roadmap, Counter };
export default Roadmap;
