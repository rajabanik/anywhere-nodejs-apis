import secureRandom from "secure-random";

export const generateOtp = (length = 6): string => {
  const randomBytes = secureRandom.randomBuffer(Math.ceil(length / 2));
  const otp = parseInt(randomBytes.toString('hex'), 16)
    .toString()
    .padStart(length, '0')
    .slice(0, length);
  return otp;
}