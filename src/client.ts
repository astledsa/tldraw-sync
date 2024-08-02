import * as Y from 'yjs'
import {mainDoc, mockDoc} from './misc';
import PartySocket from "partysocket";

export default class TLSyncClient {
  private socket: any;
  private user: string;
  private boardID: string;
  private boardState: Y.Doc;
  private connectionStatus: number;
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
    this.connectionStatus = 1;
    this.speculativeChanges = [];
    this.boardState = initialState;

    this.socket = new PartySocket({
      id: this.user,
      host: hostName || "localhost:1999",
      room: `TL_${this.boardID}`
    });
    
    // Assuming the only message received are the changes
    this.socket.addEventListener("message", (e: any) => {
      if (typeof(e.data) == typeof("")) {

        this.connectionStatus = Number(e.data);
        
      } else {
        let diff: Uint8Array = Uint8Array.from(e.data);

        // Apply patches to this board state
        Y.applyUpdate(this.boardState, diff);

      }
    });

  }

  Update (diff: Uint8Array) {

    // Apply the update to this doc
    Y.applyUpdate(this.boardState, diff);

    // Send the update to the server
    this.socket.send(diff.buffer);

    // Maintain a log of all the updates
    this.Log.push({
      time: Date.now(),
      diffs: diff
    })

    // The connection is closed: user is offline
    if (this.connectionStatus == 0) {
      this.speculativeChanges.push(diff);
    }

    // Try to reconnect and send the offline changes (if any);
    this.socket.reconnect();
    if (this.speculativeChanges.length > 0) {
      this.socket.send(this.speculativeChanges[this.speculativeChanges.length - 1]);
    }

  }
}

let client1 = new TLSyncClient ("user1", mainDoc, "1");
let client2 = new TLSyncClient ("user2", mainDoc, "1");

let diff: Uint8Array = Y.encodeStateAsUpdate(mainDoc, Y.encodeStateVector(mockDoc));
client1.Update(diff);


