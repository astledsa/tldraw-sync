import type { TLShape } from "./structs";

export function generateRandomId(length: number = 16): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomPart}`.substring(0, length);
}
  
  
export function JSONToTLShape (jsonData: any): TLShape {

    const requiredProperties = [
      'parentId', 'id', 
      'typeName', 'type', 
      'x', 'y', 'rotation', 
      'index', 'opacity', 'isLocked', 
      'props', 'meta'
    ];
  
    for (const prop of requiredProperties) {
      if (!jsonData.hasOwnProperty(prop)) {
        throw new Error(`Missing required property: ${prop}`);
      }
    }
  
    return {
        parentId: jsonData.parentId || '',
        id: jsonData.id || '',
        typeName: jsonData.typeName || '',
        type: jsonData.type || '',
        x: jsonData.x || 0,
        y: jsonData.y || 0,
        rotation: jsonData.rotation || 0,
        index: jsonData.index || '',
        opacity: jsonData.opacity || 1,
        isLocked: jsonData.isLocked || false,
        props: {
            w: jsonData.props?.w || 0,
            h: jsonData.props?.h || 0,
            geo: jsonData.props?.geo || '',
            color: jsonData.props?.color || '',
            labelColor: jsonData.props?.labelColor || '',
            fill: jsonData.props?.fill || '',
            dash: jsonData.props?.dash || '',
            size: jsonData.props?.size || '',
            font: jsonData.props?.font || '',
            text: jsonData.props?.text || '',
            align: jsonData.props?.align || '',
            verticalAlign: jsonData.props?.verticalAlign || '',
            growY: jsonData.props?.growY || 0,
            url: jsonData.props?.url || '',
        },
        meta: {
            boardID: jsonData.meta?.boardID || '',
        },
    };
}