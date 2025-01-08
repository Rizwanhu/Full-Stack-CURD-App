import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPaginatedRecipes } from '../api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string;
  user: {
    name: string;
  };
}

export default function AllRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRecipes = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await getPaginatedRecipes(pageNum);
      if (pageNum === 1) {
        setRecipes(response.data.recipes);
      } else {
        setRecipes((prevRecipes) => [...prevRecipes, ...response.data.recipes]);
      }
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes(1);
  }, []);

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRecipes(nextPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Recipes</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to My Recipes
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe._id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
              <p className="text-sm text-gray-500">by {recipe.user.name}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <h3 className="font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside mb-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm">{ingredient}</li>
                ))}
              </ul>
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <p className="text-sm">{recipe.instructions}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {page < totalPages && (
        <div className="mt-8 text-center">
          <Button onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
