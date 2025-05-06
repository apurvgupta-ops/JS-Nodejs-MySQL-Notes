import { OAuth2Client } from "google-auth-library";

const redirectUrl = "http://localhost:4000/auth/google/callback";

const client = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri: redirectUrl,
});

export function generateGoogleAuthUrl() {
  return client.generateAuthUrl({
    scope: ["email", "profile", "openid"],
  });
}

export async function fetchUserFromGoogle(code) {
  console.log("Running fetchIdToken function...");

  const { tokens } = await client.getToken(code);

  const loginTicket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: clientId,
  });

  const userData = loginTicket.getPayload();
  console.log(userData);
  return userData;
}
