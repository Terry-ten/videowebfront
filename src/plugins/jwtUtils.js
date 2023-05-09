import { KJUR } from 'jsrsasign';

export const jwtUtils = {
  parseJwt(token) {
    const parsedJwt = KJUR.jws.JWS.parse(token);
    return parsedJwt.payloadObj;
  }
};

