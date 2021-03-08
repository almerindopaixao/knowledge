interface Categories {
  id: number;
  name: string;
  parentId: number | null;
}

interface CategoriesWithPath extends Categories {
  path: string;
}

interface CategoriesTree {
  id: number;
  name: string;
  parentId: number | null;
  children?: Categories[];
}

export { Categories, CategoriesWithPath, CategoriesTree };
