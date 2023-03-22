import ChromeStorage from "../src/index";

// ChromeStorage is a class that is used to store data in the extension. It is designed to work in a way that is not async.

ChromeStorage.listen((storage) => {
  console.log("storage changes", storage);
});

ChromeStorage.set({ timer: 1 });

console.log(ChromeStorage.get("timer"));

console.log(ChromeStorage.getAll());
