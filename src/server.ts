import type * as Party from "partykit/server";


export default class WebSocketServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  onConnect(connection: Party.Connection) {
    console.log(`Connected with ${connection.id}`);
  }
  onMessage(message: string | ArrayBuffer | ArrayBufferView | Blob, connection: Party.Connection<unknown>): void | Promise<void> {
    let num = JSON.parse(message as string);
    num += 1;
    connection.send(JSON.stringify(num));
  }
}
