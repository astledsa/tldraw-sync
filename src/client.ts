import * as Y from 'yjs'
import PartySocket from "partysocket";
import board from "./mainBaord.json";
import { JSONToYDoc } from "./misc";

export default class TLSyncClient {
  private socket: any;
  private user: string;
  private boardID: string;
  private boardState: Y.Doc;
  private speculativeChanges: Uint8Array[];
  private Log: {time: number, diffs: Uint8Array}[];

  constructor(
    user: string, 
    initialState: Y.Doc, 
    boardID: string,  
    hostName?: string, 
  ) {
    this.Log = [];
    this.user = user;
    this.boardID = boardID;
    this.speculativeChanges = [];
    this.boardState = initialState;

    this.socket = new PartySocket({
      id: this.user,
      host: hostName || "localhost:1999",
      room: `TL_${this.boardID}`
    });
    
    // Assuming the only message received are the changes
    this.socket.addEventListener("message", (e: any) => {
      let diff: Uint8Array = JSON.parse(e.data);

      // Apply patches to this board state
      Y.applyUpdate(this.boardState, diff);
    });

    // Try to reconnect and send the speculative changes to the server
    setInterval (() => {
      if (this.speculativeChanges.length > 0) {
        this.socket.reconnect();
        this.socket.send(this.speculativeChanges[this.speculativeChanges.length - 1]);
      }
    }, 1000);
  }

  Update (diff: Uint8Array) {
    
    // Apply the update to this doc
    Y.applyUpdate(this.boardState, diff);

    // Send the update to the server
    this.socket.send(JSON.stringify(diff));

    // Maintain a log of all the updates
    this.Log.push({
      time: Date.now(),
      diffs: diff
    })

    // The connection is closed: user is offline
    if (this.socket.CLOSED == 3) {
      this.speculativeChanges.push(diff);
    }

  }
}


