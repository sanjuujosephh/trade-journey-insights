
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'chart' | 'poster';
  image_url: string;
};

export function useProducts() {
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at');

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    // If no products in database, return test data
    if (!data || data.length === 0) {
      return [
        {
          id: 'chart1',
          title: 'Price Action Analysis Chart',
          description: 'Advanced price action patterns and analysis',
          price: 499,
          type: 'chart',
          image_url: '/placeholder.svg'
        },
        {
          id: 'chart2',
          title: 'Technical Analysis Bundle',
          description: 'Complete set of technical analysis indicators',
          price: 699,
          type: 'chart',
          image_url: '/placeholder.svg'
        },
        {
          id: 'poster1',
          title: 'Trading Psychology Guide',
          description: 'Master your trading mindset',
          price: 299,
          type: 'poster',
          image_url: '/placeholder.svg'
        },
        {
          id: 'poster2',
          title: 'Risk Management Framework',
          description: 'Essential risk management principles',
          price: 399,
          type: 'poster',
          image_url: '/placeholder.svg'
        }
      ] as Product[];
    }

    return data as Product[];
  };

  const { 
    data: products = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const charts = products.filter(product => product.type === 'chart');
  const posters = products.filter(product => product.type === 'poster');

  return {
    charts,
    posters,
    isLoading,
    error
  };
}

