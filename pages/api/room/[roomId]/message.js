import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const username = checkToken(req);
    if (!username)
      return res.status(401).json({
        ok: false,
        message: "You don't have permission to access this api",
      });

    //get roomId from url
    
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

  

    //check if roomId exist
    const roomsIdx = rooms.find((x) => x.roomId === roomId);
    if (roomsIdx === undefined) {
      res.status(404).json({ ok: false, message: "Invalid room id" });
    } else {
      res.status(200).json({ ok: true, messages: roomsIdx.messages });
    }
    

    //find room and return
    //...
  } else if (req.method === "POST") {
    //check token
    const username = checkToken(req);
    if (!username)
      return res.status(401).json({
        ok: false,
        message: "You don't have permission to access this api",
      });

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const text = req.body.text;
    const roomsIdx = rooms.find((x) => x.roomId === roomId);

    //check if roomId exist
    const newId = uuidv4();
    const newMeg = {
      messageId: newId,
      text: text,
      username: username.username,
    };
    if (roomsIdx === undefined) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });
    else {
      roomsIdx.messages.push(newMeg);
      writeChatRoomsDB(rooms);
      return res.status(200).json({ ok: true, message: newMeg });
    }
  }
    

    //validate body
  

    //create message

   
  
}
