import { Categories, CategoriesWithPath } from '../domain/Categories';

type WithPath = (categories: Categories[]) => CategoriesWithPath[];

const withPath: WithPath = (categories) => {
  const getParent = (categories: Categories[], parentId: number | null) => {
    const parent = categories.filter((parent) => {
      if (parentId === null) {
        return parent.id === parentId;
      } else {
        return Number(parent.id) === Number(parentId);
      }
    });
    return parent.length ? parent[0] : null;
  };

  const categoriesWithPath = categories.map((category) => {
    let path = category.name;
    let parent = getParent(categories, category.parentId);

    while (parent) {
      path = `${parent.name} > ${path}`;
      parent = getParent(categories, parent.parentId);
    }

    return { ...category, path };
  });

  categoriesWithPath.sort((a, b) => {
    if (a.path < b.path) return -1;
    if (a.path > b.path) return 1;
    return 0;
  });

  return categoriesWithPath;
};

export default withPath;
