import * as Y from 'yjs'
import PartySocket from "partysocket";
import board from "./mainBaord.json";
import { JSONToYDoc } from "./misc";

class TLSyncClient {
  private socket: any;
  private user: string;
  private boardID: string;
  private Log: object[];
  private boardState: Y.Doc;

  constructor(
    user: string, 
    initialState: Y.Doc, 
    boardID: string,  
    hostName?: string, 
  ) {
    this.Log = [];
    this.user = user;
    this.boardID = boardID;
    this.boardState = initialState;

    this.socket = new PartySocket({
      id: this.user,
      host: hostName || "localhost:1999",
      room: `TL_${this.boardID}`
    });
    
    // Assuming the only meesage received are the changes
    this.socket.addEventListener("message", (e: any) => {
      let diff: Uint8Array = JSON.parse(e.data);

      // Apply patches to this board state
      Y.applyUpdate(this.boardState, diff);
    });
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
  }
}

let ydoc1 = JSONToYDoc(JSON.stringify(board));
let client1 = new TLSyncClient("user1", ydoc1, "1");
let client2 = new TLSyncClient("user2", ydoc1, "1");


