const button = document.querySelector("button");

button.addEventListener("click", () => {
  window.open(
    "http://localhost:4000/auth/google",
    "auth-popup",
    "width=500,height=600"
  );
});

window.addEventListener("message", async ({ data }) => {
  if (data.message === "success") location.href = "/";
});
