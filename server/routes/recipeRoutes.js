import express from 'express';
import { 
    createRecipe, 
    getRecipes, 
    getRecipe, 
    updateRecipe, 
    deleteRecipe,
    getPaginatedRecipes 
} from '../controllers/recipe.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Apply auth middleware to all recipe routes

// Add the pagination route
router.get('/paginated', getPaginatedRecipes);

// Your existing routes
router.post('/', createRecipe);
router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;

