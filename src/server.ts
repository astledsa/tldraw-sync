import * as Y from 'yjs'
import {mainDoc} from './misc'
import type * as Party from "partykit/server";
import board from "./mainBoard.json";


// Assume the boardState is in the Db, with the same boardID


export default class WebSocketServer implements Party.Server {
    private serverLog: {user: string, timestamp: number, diffUpdate: Uint8Array}[];
    private db: Map<string, Y.Doc>;

    constructor(readonly room: Party.Room) {
        function JSONToYDoc (shapes: string) : Y.Doc{
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

        this.serverLog = [];
        this.db = new Map<string, Y.Doc>().set("1", JSONToYDoc(JSON.stringify(board)));
    }

    onConnect(connection: Party.Connection) {

        // As soon as a user connects, send the last update in the Log
        if (this.serverLog.length > 0) {
            connection.send(JSON.stringify(this.serverLog[this.serverLog.length - 1].diffUpdate));
        }
        
    }

    onMessage(message: string | ArrayBuffer | ArrayBufferView, sender: Party.Connection<unknown>): void | Promise<void> {
        // Receive any updates send by the user
        let mes: Uint8Array = new Uint8Array(message as ArrayBuffer);

        // Apply the update to the relevant board already in the db (use the room ID)
        if (this.db.has(this.room.id)) {
            let value = this.db.get(this.room.id) ?? new Y.Doc(); // Figure this out later
            Y.applyUpdate(value, mes);

            // Broadcast the changes within the room
            this.room.broadcast(mes.buffer, [sender.id]);
        } else {
            console.log ("Error in merging changes to the Db");
        }

        // Update the log
        this.serverLog.push({
            user: sender.id,
            timestamp: Date.now(),
            diffUpdate: mes
        })
    }

    onClose(connection: Party.Connection): void | Promise<void> {
        connection.send(String(0));
    }
}
