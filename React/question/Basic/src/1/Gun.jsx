import React, { useState } from "react";

const Gun = () => {
  const [debounceInput, setDebounceInput] = useState("");
  const myDebounce = (fn, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setDebounceInput(value);
    // console.log(e.target.value);
  };

  const handleDebounceChange = myDebounce(handleChange, 1000);

  console.log(debounceInput);

  return (
    <div>
      <input onChange={handleDebounceChange} />
      Debounce data :{debounceInput}
    </div>
  );
};

export default Gun;
