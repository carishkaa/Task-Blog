import { randomBytes, scrypt, timingSafeEqual } from 'crypto'

const SALT_FACTOR = 10
const KEY_LENGTH = 64

export const scryptHash = (password: string): Promise<string> => {
  return new Promise((resolve) => {
    const salt = randomBytes(SALT_FACTOR).toString('hex')

    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      resolve(derivedKey.toString('hex') + ':' + salt)
    })
  })
}

export const scryptVerify = (
  password: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!hash) resolve(false)

    const [key, salt] = hash.split(':')

    if (!salt) {
      throw Error('Wrong hash format')
    }

    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      resolve(timingSafeEqual(Buffer.from(key, 'hex'), derivedKey))
    })
  })
}
