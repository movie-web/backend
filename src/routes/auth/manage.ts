import { formatSession } from '@/db/models/Session';
import { User, formatUser } from '@/db/models/User';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { makeSession, makeSessionToken } from '@/services/session';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().max(500).min(1),
  device: z.string().max(500).min(1),
  profile: z.object({
    colorA: z.string(),
    colorB: z.string(),
    icon: z.string(),
  }),
});

export const manageAuthRouter = makeRouter((app) => {
  app.post(
    '/auth/register',
    { schema: { body: registerSchema } },
    handle(async ({ em, body, req }) => {
      const user = new User();
      user.name = body.name;
      user.profile = body.profile;

      const session = makeSession(
        user.id,
        body.device,
        req.headers['user-agent'],
      );

      await em.persistAndFlush([user, session]);

      return {
        user: formatUser(user),
        session: formatSession(session),
        token: makeSessionToken(session),
      };
    }),
  );
});