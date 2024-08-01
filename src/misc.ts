import * as Y from 'yjs'

export function JSONToYDoc (shapes: string) : Y.Doc{
  let json;
  try {
    json = JSON.parse(shapes);
  } catch (error) {
    console.error('Invalid JSON string:', error);
  }

  const ydoc = new Y.Doc()
  const ymap = ydoc.getMap('root')
  
  function TLShapeToYDoc(obj : string, yparent : Y.Map<unknown>) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        const nestedYMap = new Y.Map()
        TLShapeToYDoc(value, nestedYMap)
        yparent.set(key, nestedYMap)
      } else {
        yparent.set(key, value)
      }
    }
  }

  TLShapeToYDoc(json, ymap)
  return ydoc
}