// CategoryContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAllCategories } from '../api/apiMethods';

export interface Category {
  _id: string;
  category_name: string;
  category_slug: string;
  category_image: string;
  meta_title: string;
  meta_description: string;
  status: number;
  totalviews: number;
  ratings: number | null;
  seo_content?: string;               // <-- added
}

interface CategoryContextType {
  categories: Category[];
  selectedCategory?: Category;       // <-- new
  error: string | null;
  loading: boolean;
}

export const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  error: null,
  loading: false,
});

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = (await getAllCategories({})) as { success: boolean; data: Category[] };
        if (res.success) setCategories(res.data);
        else setError('Invalid response');
      } catch (e: any) {
        setError(e?.message ?? 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, error, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};
// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { getAllCategories } from '../api/apiMethods';

// interface Category {
//   _id: string;
//   category_name: string;
//   category_slug: string;
//   category_image: string;
//   meta_title: string;
//   meta_description: string;
//   status: number;
//   totalviews: number;
//   ratings: number | null;
//   seo_content: string;
// }

// interface CategoryContextType {
//   categories: Category[];
//   error: string | null;
//   loading: boolean;
// }

// interface CategoryResponse {
//   success: boolean;
//   data: Category[];
// }

// export const CategoryContext = createContext<CategoryContextType>({
//   categories: [],
//   error: null,
//   loading: false,
// });

// export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [categories, setAllCategories] = useState<Category[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const response = await getAllCategories({}) as CategoryResponse;
//       if (response.success === true && Array.isArray(response.data)) {
//         setAllCategories(response.data);
//       } else {
//         setError('Invalid response format');
//       }
//     } catch (err: any) {
//       setError(err?.message || 'Failed to fetch categories');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <CategoryContext.Provider value={{ categories, error, loading }}>
//       {children}
//     </CategoryContext.Provider>
//   );
// };