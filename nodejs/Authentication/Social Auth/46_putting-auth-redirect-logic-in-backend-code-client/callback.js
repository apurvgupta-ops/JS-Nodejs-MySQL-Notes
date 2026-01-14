const sid = new URLSearchParams(location.search).get("sid");
if (sid) {
  const baseURL = "http://localhost:4000";
  const response = await fetch(`${baseURL}/session-cookie?sid=${sid}`, {
    credentials: "include",
  });

  if (response.status === 200) {
    window.opener.postMessage({ message: "success" });
    window.close();
  }
}
