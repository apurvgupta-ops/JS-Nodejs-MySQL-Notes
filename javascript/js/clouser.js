function parent() {
  const a = 10;
  const b = 100;
  const c = 1000;

  function child() {
    console.log(a);

    function innerChild() {
      console.log(b);
    }
  }
  child();
}
parent();
