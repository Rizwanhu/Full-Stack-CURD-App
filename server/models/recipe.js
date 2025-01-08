import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: [{
        type: String,
        required: true,
        trim: true
    }],
    instructions: {
        type: String,
        required: true,
        trim: true
    },
    cookingTime: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;