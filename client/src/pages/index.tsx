import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from '../api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cookingTime, setCookingTime] = useState<number>(0);
  const navigate = useNavigate();


  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await getRecipes();
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const recipeData = {
        title,
        ingredients: ingredients.split(',').map((i) => i.trim()).filter(i => i),
        instructions,
        cookingTime: Number(cookingTime)
      };
      
      if (!recipeData.title || !recipeData.ingredients.length || !recipeData.instructions || recipeData.cookingTime < 0) {
        console.error('Invalid recipe data:', recipeData);
        return;
      }
      
      console.log('Submitting recipe data:', recipeData);
      
      if (editingId) {
        await updateRecipe(editingId, recipeData);
      } else {
        await createRecipe(recipeData);
      }
      
      setTitle('');
      setIngredients('');
      setInstructions('');
      setCookingTime(0);
      setEditingId(null);
      fetchRecipes();
    } catch (error: any) {
      console.error('Failed to save recipe:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setTitle(recipe.title);
    setIngredients(recipe.ingredients.join(', '));
    setInstructions(recipe.instructions);
    setCookingTime(recipe.cookingTime);
    setEditingId(recipe._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecipe(id);
      fetchRecipes();
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');

  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Recipe App</h1>
        <div className="flex gap-4">
          <Link to="/all-recipe">
            <Button variant="outline">
              View All Recipes
            </Button>
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Recipe' : 'Create New Recipe'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
                Ingredients (comma-separated)
              </label>
              <Input
                type="text"
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                Instructions
              </label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">
                Cooking Time (minutes)
              </label>
              <Input
                type="number"
                id="cookingTime"
                value={cookingTime}
                onChange={(e) => setCookingTime(Number(e.target.value))}
                min="0"
                required
              />
            </div>
            <Button type="submit">{editingId ? 'Update' : 'Create'} Recipe</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe._id}>
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">Ingredients:</h3>
              <ul className="list-disc list-inside mb-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h3 className="font-semibold">Instructions:</h3>
              <p>{recipe.instructions}</p>
              <h3 className="font-semibold mt-2">Cooking Time:</h3>
              <p>{recipe.cookingTime} minutes</p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => handleEdit(recipe)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(recipe._id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

