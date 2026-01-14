const nameElement = document.querySelector("#name");
const emailElement = document.querySelector("#email");
const imageElement = document.createElement("img");
const logoutButton = document.querySelector("button");

const baseURL = "http://localhost:4000";

logoutButton.addEventListener("click", async () => {
  const response = await fetch(`${baseURL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (response.status === 204) {
    location.href = "./login";
  }
});

const response = await fetch(`${baseURL}/profile`, {
  credentials: "include",
});

if (response.status === 401) {
  location.href = "./login";
}

const { name: fullName, email, picture } = await response.json();

nameElement.textContent = fullName;
emailElement.textContent = email;

imageElement.src = picture;
document.body.appendChild(imageElement);
