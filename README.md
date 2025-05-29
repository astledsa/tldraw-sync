## TLDraw Sync with PartyKit

This project provides synchronization functionalities for Tldraw/Text, enabling real-time collaboration.  It utilizes PartyKit for server-side operations and yjs for collaborative editing capabilities. 

### Features
Real-time synchronization for Tldraw-like drawing or text editing. 

### Technologies Used
- PartyKit: For powering the WebSocket server and real-time communication. 
- Yjs: For collaborative data structures and synchronization. 
- TypeScript: For type-safe development. 
- Partysocket: A WebSocket client for PartyKit. 

### Project Structure
The key directories and files include: 

- `public/`: Contains static assets like index.html and normalize.css.
- `src/`: Contains the core application logic, including:
`client.ts`
- `server.ts`: The main WebSocket server implementation.
- `mockBoard.json` and `mainBoard.json`: Contain initial or mock board data.

### Development
To run or deploy the project, you can use the following scripts defined in package.json: 

`npm run dev`: Starts the development server with live reloading. 
`npm run deploy`: Deploys the application.
