class BinarySearchTree {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.parent = this;
  }

  addNode(data) {
    if (data < this.data) {
      if (!this.left) {
        this.left = new BinarySearchTree(data);
        this.left.parent = this;
      } else {
        this.left.addNode(data)
      }
    } else if (data > this.data) {
      if (!this.right) {
        this.right = new BinarySearchTree(data);
        this.right.parent = this;
      } else {
        this.right.addNode(data);
      }
    } else {
      throw Error('Node Already Exists');
    }
  }

  search(input) {
    if (input === this.data) {
      return this;
    }

    let result = null;

    const traverse = function(node) {
      if (input === node.data) {
        result = node;
      } else {
        node.left && traverse(node.left);
        node.right && traverse(node.right);
      }
    }

    traverse(this);
    return result;
  }

  contains(input, reversed = false) {
    let result = false;

    let inclusionCheck = function(input) {
      if(!this) {
        result = false;
      } else if(input === this.data){
        result = true;
      } else if(!reversed && input < this.data){
        inclusionCheck.call(this.left, input);
      } else if(!reversed && input > this.data){
        inclusionCheck.call(this.right, input);
      } else if (reversed && input < this.data) {
        inclusionCheck.call(this.right, input);
      } else if (reversed && input > this.data) {
        inclusionCheck.call(this.left, input);
      }
    };

    inclusionCheck.call(this, input);
    return result;
  };

  depthFirstSearch(order_type) {
    let result = [];
    const traverse = (node) => {
      if (order_type === "pre_order") {
        result.push(node.data);
        node.left && traverse(node.left);
        node.right && traverse(node.right);
      } else if (order_type === "in_order") {
        node.left && traverse(node.left);
        result.push(node.data);
        node.right && traverse(node.right);
      } else if (order_type === "post_order") {
        node.left && traverse(node.left);
        node.right && traverse(node.right);
        result.push(node.data);
      }
    }

    traverse(this);

    return result
  }

  depthFirstForEach(order_type, cb) {
    const traverse = (node) => {
      if (order_type === "pre_order") {
        cb(node.data);
        node.left && traverse(node.left);
        node.right && traverse(node.right);
      } else if (order_type === "in_order") {
        node.left && traverse(node.left);
        cb(node.data);
        node.right && traverse(node.right);
      } else if (order_type === "post_order") {
        node.left && traverse(node.left);
        node.right && traverse(node.right);
        cb(node.data);
      }
    }

    traverse(this);
  }

  breadthFirstSearch(result = []) {
    let current = [this];

    while(current.length > 0){
      let next = [];

      for(let node of current) {
        result.push(node.data);

        if(node.left){
          next.push(node.left);
        }
        if(node.right){
          next.push(node.right);
        }
      }

      current = next;
    }

    return result;
  }

  breadthFirstForEach(cb) {
    let current = [this];

    while(current.length > 0){
      let next = [];

      for(let node of current) {
        cb(node.data);

        if(node.left){
          next.push(node.left);
        }
        if(node.right){
          next.push(node.right);
        }
      }

      current = next;
    }
  }

  reverseTree(node) {
    if (node === null) {
      return;
    }

    let temp = node.right;
    node.right = node.left;
    node.left = temp;

    this.reverseTree(node.left);

    this.reverseTree(node.right)
  }
}

class MinHeap {
  constructor() {
    this.data = [];
  }

  insert(item) {
    this.data.push(item);
    this.bubbleUp(this.data.length - 1);
  }

  bubbleUp(index) {
    while(index > 0) {
      let parent = Math.floor((index + 1) /2) -1;
      if (this.data[parent] > this.data[index]) {
        let temp = this.data[parent];
        this.data[parent] = this.data[index];
        this.data[index] = temp;
      }

      index = parent;
    }
  }

  extractMin() {
    let min = this.data[0];
    this.data[0] = this.data.pop();

    this.bubbleDown(0);

    return min;
  }

  bubbleDown(index) {
    while(true) {
      let child = (index + 1) * 2;

      let sibling = child - 1;
      let toSwap = null;

      if (this.data[index] > this.data[child]) {
        toSwap = child;
      }

      if (this.data[index] > this.data[sibling] && (this.data[child] === null || (this.data[child] !== null && this.data[sibling] < this.data[child]))) {
        toSwap = sibling;
      }

      if (toSwap === null) {
        break;
      }

      let temp  = this.data[toSwap];
      this.data[toSwap] = this.data[index];
      this.data[index] = temp;

      index = toSwap;
    }
  }

  toArray(tree) {
    return tree.depthFirstSearch('pre_order');
  }

  heapify() {
    let root = this.data[0];

    let BST = new BinarySearchTree(root);

    this.data.slice(1).forEach(el => {
      BST.addNode(el);
    })

    return BST;
  }
}

let heap = new MinHeap();

heap.insert(5);
heap.insert(4);
heap.insert(8);
heap.insert(6);
heap.insert(1);
heap.insert(14);
heap.insert(2);
heap.insert(7);

let heapifiedMinHeap = heap.heapify();
console.log(heap.toArray(heapifiedMinHeap));
console.log(heap.extractMin());
console.log("HEAP IS NOW: ", heap.toArray(heap.heapify()))




class BinaryMinHeap {
  constructor(data = []) {
    this.array = [];
    this.nodes = {};
    if (data && Array.isArray(data)) {
      this.array = data;
      const length = this.array.length;
      for (let i = Math.floor((length - 1) / 2); i >= 0; i--) {
        this.bubbleDown(i, this.array[i]);
      }
    }
  }

  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  getLeftChild(parentIndex) {
    return (parentIndex * 2) + 1;
  }

  getRightChild(parentIndex) {
    return (parentIndex * 2) + 2;
  }

  add(data) {
    if (data === undefined) {
      throw new Error('data must be valid to add');
    }
    this.array.push(data);
    this.bubbleUp(this.array.length - 1, data);
  }

  removeHead() {
    const headNode = this.array[0];
    const tailNode = this.array.pop();
    let counter = 0;

    if (this.array.length) {
      this.array[0] = tailNode;
      this.bubbleDown(0, tailNode);
    }

    delete this.nodes[headNode];
    this.decreaseMapIndexes();

    return headNode;
  }

  decreaseMapIndexes(counter = 0) {
    for (let node in this.array) {
      this.nodes[this.array[node]] = counter;
      counter++;
    }
  }


  bubbleDown(parentIndex, parentData) {
    if (parentIndex < this.array.length) {
      let targetIndex = parentIndex;
      let targetData = parentData;
      const leftChildIndex = this.getLeftChild(parentIndex);
      const rightChildIndex = this.getRightChild(parentIndex);

      const trySwap = (index, array, shouldSwap) => {
        if (index < array.length) {
          const data = array[index];
          if (this.shouldSwap(data, targetData)) {
            targetIndex = index;
            targetData = data;
          }
        }
      };

      trySwap(leftChildIndex, this.array, this.shouldSwap);
      trySwap(rightChildIndex, this.array, this.shouldSwap);

      if (targetIndex !== parentIndex) {
        this.array[parentIndex] = targetData;
        this.array[targetIndex] = parentData;
        this.bubbleDown(targetIndex, parentData);
      }
    }
  }

  bubbleUp(childIndex, childData) {
    if (childIndex > 0) {
      const parentIndex = this.getParentIndex(childIndex);
      const parentData = this.array[parentIndex];

      if (this.shouldSwap(childData, parentData)) {
        this.array[parentIndex] = childData;
        this.array[childIndex] = parentData;
        this.nodes[this.array[childIndex]] = childIndex;
        this.nodes[this.array[parentIndex]] = parentIndex;
        this.bubbleUp(parentIndex, childData);
      } else {
        this.nodes[this.array[childIndex]] = childIndex;
        this.nodes[this.array[parentIndex]] = parentIndex;
      }
    }
  }

  shouldSwap(childData, parentData) {
    return childData < parentData;
  }

  hasNode(data) {
    // O(1) Constant time complexity
    return this.nodes[data] >= 0;
  }

  contains(data) {
    // O(log n) Logarithmic time complexity
    let sortedData = this.array;
    let min = 0;
    let max = sortedData.length - 1;

    while(min <= max) {
      let mid = sortedData.length % 2 !== 0 ? min + (max-min)/2 : Math.round(min + (max - min)/2);

      if (data < sortedData[mid]) {
        if (sortedData[mid - 1] === data || sortedData[mid + 1] === data || sortedData[mid - 2] === data || sortedData[mid + 2] === data) {
          return true;
        }
        max = mid - 2 < 0 ? mid - 1 : mid - 2;
      } else if (data > sortedData[mid]) {
        if (sortedData[mid - 1] === data || sortedData[mid + 1] === data || sortedData[mid - 2] === data || sortedData[mid + 2] === data) {
          return true;
        }
        min = mid + 2 >= sortedData.length ? mid + 1 : mid + 2;
      } else {
        return true;
      }
    }

    return false;
  }
}

console.log("\n\n\n\n");
let c = new BinaryMinHeap();
c.add(3);
c.add(9);
c.add(33);
c.add(1);
c.add(2);
c.add(4);
c.add(5);
c.add(6);
c.add(10);
c.add(11);
console.log("OUR NEW BinaryMinHeap IS: ", c);
console.log(c.contains(23))
console.log(c.contains(5))
console.log(c.contains(33))
console.log(c.contains(9))
console.log(c.hasNode(23))
console.log(c.hasNode(5))
console.log(c.hasNode(33))
console.log(c.hasNode(9))
console.log(c.removeHead())
console.log("\n\nMINHEAP IS: ", c);
module.exports = BinaryMinHeap;



