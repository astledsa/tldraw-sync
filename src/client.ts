import PartySocket from "partysocket";
import * as Y from 'yjs'

function generateRandomId(length: number = 16): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`.substring(0, length);
}

export interface TLShape {
  parentId: string;
  id: string;
  typeName: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  index: string;
  opacity: number;
  isLocked: boolean;
  props: {
    w: number;
    h: number;
    geo: string;
    color: string;
    labelColor: string;
    fill: string;
    dash: string;
    size: string;
    font: string;
    text: string;
    align: string;
    verticalAlign: string;
    growY: number;
    url: string;
  };
  meta: {
    boardID: string;
    userID: string;
  }; 
}

export function JSONToTLShape (jsonData: any): TLShape {
  const requiredProperties = [
    'parentId', 'id', 'typeName', 'type', 'x', 'y', 'rotation', 'index', 'opacity', 'isLocked', 'props', 'meta'
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
      userID: jsonData.meta?.userID || '',
    },
  };
}

export default class TLSyncClient {
  private socket: any;
  private user: string;
  private boardID: string;
  private boardState: TLShape;

  constructor(user: string, initialState: TLShape, boardID?: string,  hostName?: string, roomName?: string) {
    this.user = user;
    this.boardState = initialState;
    this.boardID = boardID || generateRandomId(16);
    this.socket = new PartySocket({
      id: this.boardID,
      host: hostName || "localhost: 1999",
      room: roomName || "room",
    });
  }

  Reconnect () {};

}

