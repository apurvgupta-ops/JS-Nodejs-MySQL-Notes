window.onload = function () {
  google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      console.log(response);
      if (response.credential) {
        loginUserWithIdToken(response.credential);
      } else {
        console.log("Something went wrong!");
      }
    },
  });

  google.accounts.id.renderButton(document.getElementById("google-login"), {
    theme: "filled_blue",
    shape: "pill",
  });
  google.accounts.id.prompt();
};

async function loginUserWithIdToken(idToken) {
  const baseURL = "http://localhost:4000";
  const response = await fetch(`${baseURL}/auth/google`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (response.status === 200) {
    // location.href = "/";
  }
}
