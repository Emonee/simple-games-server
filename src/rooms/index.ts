import CustomSet from "../classes/customObjects/CustomSet";
import Room from "../classes/Room";
import User from "../classes/User";

class RoomsSet extends CustomSet {
  sendMessageToRoom (roomId: number, user: User, message: string) {
    const room: Room = this.find((room: Room) => room.id === roomId)
    room.sendMessage(user, message)
  }
}

export const rooms = new RoomsSet()
