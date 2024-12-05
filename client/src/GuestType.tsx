export type Guest = {name: string, 
  info: {host: "Molly" | "James", isFamily: boolean, plusone: undefined | 0 | 1, plusonename?: string,
    restrictions?: {guest: string, addguest?: string}}};


/** 
 * Creats a JSON representation of given Square. 
 * @param guest to convert to JSON
 * @returns JSON describing the given square
 */
export const toJson = (guest: Guest): unknown => {
  return [
    guest.name, 
    [
      guest.info.host, guest.info.isFamily, guest.info.plusone, guest.info.plusonename, 
      [guest.info.restrictions?.guest, guest.info.restrictions?.addguest]
    ]
  ]
};

/** 
 * Converts a JSON description to the Square it describes. 
 * @param data in JSON form to try to parse as Square
 * @returns a Square parsed from given data
 */
export const fromJson = (data: unknown): Guest => {
  if (Array.isArray(data)) {
    const newGuest: Guest = {
      name: data[0],
      info: {
        host: data[1][0],
        isFamily: data[1][1],
        plusone: (data[1][2]===null) ? undefined : data[1][2],
        plusonename: (data[1][3]===null) ? undefined : data[1][3],
        restrictions: {
          guest: data[1][4][0],
          addguest: (data[1][4][1]===null) ? undefined : data[1][4][1]
        }
      }
    }
    return newGuest;
  } else {
    throw new Error(`type ${typeof data} is not a valid guest`);
  }
}