import PartySocket from "partysocket";

let data: number = 2190;

const ws = new PartySocket({
  host: "localhost:1999", 
});

ws.send(JSON.stringify(data));
ws.addEventListener('message', (e) => {
  let res = JSON.parse(e.data);
  console.log(`Modified number: ${res}`);
})

