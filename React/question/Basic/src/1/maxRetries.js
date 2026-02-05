const RetriesMechanism = async (fn, maxTry = 3, delay = 1000) => {
  let lasterror;
  for (let tryies = 1; tryies <= maxTry; tryies++) {
    try {
      return await fn();
    } catch (error) {
      console.log(error);
      lasterror = error;
      if (tryies === maxTry) throw lasterror;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

// const apiCall = () =>
//   fetch("https://jsonplaceholder.typicode.com/todos").then((res) => {
//     if (!res.ok) throw new Error("Network error");
//     return res.json();
//   });

// RetriesMechanism(apiCall, 3, 2000)
//   .then((data) => console.log("Success", data))
//   .catch((err) => console.error("Failed after retries", err));
