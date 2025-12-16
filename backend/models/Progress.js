import mongoose from 'mongoose';

const subtopicProgressSchema = new mongoose.Schema({
    subtopicContent: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
});

const progressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        roadmapId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Roadmap',
            required: true,
        },
        topicId: {
            type: String,
            required: true,
        },
        // Almacena el estado de cada checkbox
        subtopicProgress: [subtopicProgressSchema], 
        
        // Estado general del tema
        isTopicCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

progressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;