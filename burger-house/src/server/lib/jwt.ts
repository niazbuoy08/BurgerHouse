import dotenv from 'dotenv';
dotenv.config();

import * as jwt from 'jsonwebtoken';
import type { NextApiResponse, NextApiRequest } from 'next';
import { Cookie } from 'next-cookie';
import type { User } from '../models/user.model';
const environment = 'development';
export const signToken = (
  payload: { user: User },
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = jwt.sign({ _id: payload.user._id }, 'mysecretkey', {
    expiresIn: 2 * 60 * 60,
  });

  const cookie = Cookie.fromApiRoute(req, res);

  // cookie.set('burgerHouse', token, {
  //   secure:  === 'production',
  //   httpOnly: true,
  //   sameSite: 'strict',
  //   maxAge: 2 * 60 * 60,
  //   path: '/',
  // });

  return token;
};

export const decodeToken = (token: string) => {
  const payload = jwt.verify(token, 'mysecretkey');
  return payload;
};
