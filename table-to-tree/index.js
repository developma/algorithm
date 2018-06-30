class TestData {
  getData() {
    return [
      { id: 1, parentID: null, hasChild: true },
      { id: 2, parentID: 1, hasChild: true },
      { id: 3, parentID: 1, hasChild: true },
      { id: 4, parentID: 1, hasChild: true },
      { id: 5, parentID: 1, hasChild: true },
      { id: 6, parentID: 2, hasChild: true },
      { id: 7, parentID: 6, hasChild: false },
      { id: 8, parentID: 6, hasChild: false },
      { id: 9, parentID: 6, hasChild: false },
      { id: 10, parentID: 3, hasChild: false },
      { id: 11, parentID: 3, hasChild: false },
      { id: 12, parentID: 3, hasChild: false },
      { id: 13, parentID: 3, hasChild: false },
      { id: 14, parentID: 4, hasChild: true },
      { id: 15, parentID: 14, hasChild: true },
      { id: 16, parentID: 15, hasChild: false },
      { id: 17, parentID: 4, hasChild: false },
      { id: 18, parentID: 5, hasChild: false },
      { id: 19, parentID: 15, hasChild: true },
      { id: 20, parentID: 19, hasChild: false },
      { id: 21, parentID: 19, hasChild: false },
      { id: 22, parentID: 19, hasChild: false },
      { id: 23, parentID: 19, hasChild: false }
    ]
  }
}
class TreeData {
  constructor(id, parentID, hasChild) {
    this.id = id
    this.parentID = parentID
    this.hasChild = hasChild
  }
}

class Converter {
  convertToTree(nodes) {
    const rootNodes = nodes.filter(node => !node.parentID)
    const rootNode = rootNodes[0]
    rootNode.children = this.buildChildNode(rootNode, nodes)
    console.log('result', rootNode)
  }

  /**
   * Depth first search
   * @param {*} parentNode
   * @param {*} nodes
   */
  buildChildNode(parentNode, nodes) {
    const parentNodeID = parentNode.id
    const childNodes = []
    nodes.forEach(node => {
      if (node.parentID === parentNodeID) {
        childNodes.push(node)
        if (node.hasChild) {
          node.children = this.buildChildNode(node, nodes)
        }
      }
    })
    return childNodes
  }

  /**
   * Bottom-Up approach
   * @param {*} nodes
   * @param {*} endNodes
   */
  collectParent(nodes, endNodes) {
    const newTree = []
    endNodes.forEach(endNode => {
      const idx = newTree.findIndex(tree => {
        return tree.id === endNode.parentID
      })
      if (idx === -1) {
        // 親ノードを探索
        const filteredNodes = nodes.filter(node => node.id === endNode.parentID)
        // 親ノードが見つからない場合はルートノードと見做す
        const filteredNode =
          filteredNodes.length === 1
            ? filteredNodes[0]
            : nodes.filter(node => node.parentID === null)[0]
        const rootNodeIdx = newTree.findIndex(
          rootNode => rootNode.id === filteredNode.id
        )
        if (rootNodeIdx === -1) {
          filteredNode.children = []
        }
        console.log('filteredNode', filteredNode)
        filteredNode.children.push(Object.assign({}, endNode))
        newTree.push(Object.assign({}, filteredNode))
      } else {
        newTree[idx].children.push(Object.assign({}, endNode))
      }
    })
    console.log('length', newTree.length)
    if (newTree.length === 1) {
      return newTree[0]
    }
    return this.collectParent(nodes, newTree)
  }
}

const data = new TestData()
const converter = new Converter()
converter.convertToTree(data.getData())
