import { OAuth2Client } from "google-auth-library";

const clientId =
  "594555697613-18p3s2o6hl7mvc3gj0o2a2bg7b27tj9m.apps.googleusercontent.com";

const client = new OAuth2Client({
  clientId,
});

export async function verifyIdToken(idToken) {
  const loginTicket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });

  const userData = loginTicket.getPayload();
  return userData;
}
