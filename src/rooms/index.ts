import CustomSet from "../classes/customObjects/CustomSet";
import Room from "../classes/Room";

class RoomsSet extends CustomSet {
  changeRoomName (roomId: number, newName: string) {
    const room: Room = this.find((room: Room) => room.id === roomId)
    this.delete(room)
    room.name = newName
    this.add(room)
  }
}

export const rooms = new RoomsSet()
