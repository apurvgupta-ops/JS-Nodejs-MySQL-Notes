const maxRetries = async (fn, maxTry = 3, delay = 1000) => {
    let lasterror;
    for (let tryies = 1; tryies <= maxTry; tryies++) {
        try {
            return await fn();
        } catch (error) {
            console.log(error);
            lasterror = error;
            if (tryies === maxTry) throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
    }
};

const apiCall = fetch("/www.google.com")
    .then((data) => data.json())
    .catch((err) => console.log(err));

maxRetries(apiCall);
