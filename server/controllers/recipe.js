import Recipe from '../models/recipe.js';

// Create a new recipe
export const createRecipe = async (req, res) => {
    try {
        console.log('Received recipe data:', req.body);
        console.log('User ID from auth:', req.userId);
        
        if (!req.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { title, ingredients, instructions, cookingTime } = req.body;
        if (!title || !ingredients || !instructions || cookingTime === undefined) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                received: { title, ingredients, instructions, cookingTime }
            });
        }

        if (typeof cookingTime !== 'number' || cookingTime < 0) {
            return res.status(400).json({ 
                message: 'Cooking time must be a positive number',
                received: cookingTime
            });
        }

        const recipe = await Recipe.create({ 
            ...req.body, 
            user: req.userId  // Make sure user ID is included
        });
        
        res.status(201).json(recipe);
    } catch (error) {
        console.error('Recipe creation error:', error);
        res.status(400).json({ 
            message: error.message,
            details: error
        });
    }
};

// Get all recipes for a user
export const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.userId });
        res.json(recipes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single recipe
export const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, user: req.userId });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a recipe
export const updateRecipe = async (req, res) => {
    try {
        // Add validation logging
        console.log('Updating recipe with data:', req.body);
        
        // Validate required fields
        const { title, ingredients, instructions, cookingTime } = req.body;
        if (!title || !ingredients || !instructions || cookingTime === undefined) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                received: { title, ingredients, instructions, cookingTime }
            });
        }

        // Validate cookingTime is a number
        if (typeof cookingTime !== 'number' || cookingTime < 0) {
            return res.status(400).json({ 
                message: 'Cooking time must be a positive number',
                received: cookingTime
            });
        }

        const recipe = await Recipe.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        console.error('Recipe update error:', error);
        res.status(400).json({ 
            message: error.message,
            details: error
        });
    }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get paginated recipes
export const getPaginatedRecipes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const recipes = await Recipe.find()
            .skip(skip)
            .limit(limit)
            .populate('user', 'name');

        const total = await Recipe.countDocuments();

        res.json({
            recipes,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
