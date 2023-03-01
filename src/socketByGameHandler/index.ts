import { Namespace, Socket } from "socket.io";
import RPS from "../classes/games/specificGames/RPS/RPS";
import Room from "../classes/Room";
import RPSHandler from "./RPSHandler";

export default function (roomNamespace: Namespace, socket: Socket, room: Room) {
  const { game } = room
  if (game instanceof RPS) return RPSHandler(roomNamespace, socket, room)
}
