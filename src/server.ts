import * as Y from 'yjs'
import { JSONToYDoc } from "./misc";
import board from "./mainBaord.json";
import type * as Party from "partykit/server";

let ydoc1 = JSONToYDoc(JSON.stringify(board));

// Assume the boardState is in the Db, with the same boardID
let db = new Map<string, Y.Doc>();
db.set("1", ydoc1);

export default class WebSocketServer implements Party.Server {
    constructor(readonly room: Party.Room) {}

    onConnect(connection: Party.Connection) {
        
    }

    onMessage(message: string | ArrayBuffer | ArrayBufferView, sender: Party.Connection<unknown>): void | Promise<void> {
        // Recieve any updates send by the user
        let mes: Uint8Array = JSON.parse(String(message));

        // Apply the update to the relevant board already in the db (use the room ID)
        if (db.has(this.room.id)) {
            let value = db.get(this.room.id) ?? new Y.Doc(); // Figure this out later
            Y.applyUpdate(value, mes);

            // Broadcast the changes within the room
            this.room.broadcast(JSON.stringify(mes), [sender.id]);
        } else {
            console.error ("Error in merging changes to the Db");
        }
    }
}
