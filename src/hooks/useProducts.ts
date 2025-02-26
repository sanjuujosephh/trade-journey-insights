
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

    if (error) throw error;
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
