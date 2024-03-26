class TreeNode<T> {
  key: string;
  value: T;
  parent: TreeNode<T> | null;
  children: TreeNode<T>[];

  constructor(key: string, value: T, parent: TreeNode<T> | null = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.children = [];
  }

  get isLeaf(): boolean {
    return this.children.length === 0;
  }

  get hasChildren(): boolean {
    return !this.isLeaf;
  }
}

class Tree<T> {
  root: TreeNode<T>;

  constructor(key: string, value: T) {
    this.root = new TreeNode(key, value);
  }

  *preOrderTraversal(
    node: TreeNode<T> = this.root
  ): Generator<TreeNode<T>, void, unknown> {
    yield node;
    if (node.children.length) {
      for (const child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  *postOrderTraversal(
    node: TreeNode<T> = this.root
  ): Generator<TreeNode<T>, void, unknown> {
    if (node.children.length) {
      for (const child of node.children) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  insert(parentNodeKey: string, key: string, value: T): boolean {
    for (const node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.children.push(new TreeNode(key, value, node));
        return true;
      }
    }
    return false;
  }

  remove(key: string): boolean {
    for (const node of this.preOrderTraversal()) {
      const filtered = node.children.filter((c) => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }

  find(key: string): TreeNode<T> | undefined {
    for (const node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }
}

export { Tree }