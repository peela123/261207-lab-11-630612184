import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  //check token

  const username = checkToken(req);
  if (!username) {
    return res.status(401).json({
      ok: false,
      message: "You don't have permission to access this api",
    });
  }
  const rooms = readChatRoomsDB();
  const findRoom = rooms.find((x) => x.roomId === roomId);
  //check if roomId exist
  if (findRoom === undefined) {
    return res.status(404).json({ ok: false, message: "Invalid room id" });
  }
  //check if messageId exist
  const findMessage = findRoom.messages.find((x) => x.messageId === messageId);
  if (findMessage === undefined) {
    return res.status(404).json({ ok: false, message: "Invalid message id" });
  }
  //check if token owner is admin, they can delete any message
  if (username.isAdmin) {
    findRoom.messages = findRoom.messages.filter(
      (x) => x,
      messageId !== messageId
    );
    rooms.messages = findRoom.messages;
    writeChatRoomsDB(rooms);
    return res.json({ ok: true });
  } else {
    if (username.username === findMessage.username) {
      findRoom.messages = findRoom.messages.filter(
        (x) => x.messageId !== messageId
      );
      rooms.messages = findRoom.messages;
      writeChatRoomsDB(rooms);
      return res.json({ ok: true });
    } else {
      return res
        .status(401)
        .json({
          ok: false,
          message: "You don't have permission to access this api",
        });
    }
  }
  //or if token owner is normal user, they can only delete their own message!
}