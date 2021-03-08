import { Categories, CategoriesTree } from '../domain/Categories';

const toTree = (
  categories: Categories[],
  tree?: CategoriesTree[],
): CategoriesTree[] => {
  if (!tree) tree = categories.filter((c) => !c.parentId);
  tree = tree.map((parentNode) => {
    const isChild = (node: Categories) => node.parentId == parentNode.id;
    parentNode.children = toTree(categories, categories.filter(isChild));
    return parentNode;
  });
  return tree;
};

export default toTree;
