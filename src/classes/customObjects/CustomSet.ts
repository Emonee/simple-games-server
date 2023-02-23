export default class CustomSet extends Set {
  find (cb: Function) {
    let result
    for (const room of this) {
      if (!cb(room)) continue
      result = room
      break
    }
    return result
  }
}