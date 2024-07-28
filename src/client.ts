import type { DiffChange, TLShape } from "./structs";
import { generateRandomId } from './misc'
import PartySocket from "partysocket";
import * as Y from 'yjs'

export default class TLSyncClient {
  private socket: any;
  private user: string;
  private boardID: string;
  private boardState: TLShape;
  private Log: DiffChange[];

  constructor(
    user: string, 
    initialState: TLShape, 
    boardID?: string,  
    hostName?: string, 
    roomName?: string
  ) {
    this.Log = [];
    this.user = user;
    this.boardState = initialState;
    this.boardID = boardID || generateRandomId(16);
    this.socket = new PartySocket({
      id: this.boardID,
      host: hostName || "localhost: 1999",
      room: roomName || "room",
    });
  }

  Merge (changes: DiffChange[]) {

    // Merge changes into boardState

    this.Log = [...this.Log, ...changes];
  }

  Reconnect () {};

}

