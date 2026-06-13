// Human-friendly character set: no O, 0, I, 1 to avoid confusion
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 5

export function generateCode(): string {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CHARSET.length)
    code += CHARSET[randomIndex]
  }
  return code
}

// Total possible codes: 32^5 = 33,554,432
export function isValidCode(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false
  return code.split('').every(char => CHARSET.includes(char))
}

export function sanitizeCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/O/g, '0') // auto-correct common mistakes
    .slice(0, CODE_LENGTH)
}
