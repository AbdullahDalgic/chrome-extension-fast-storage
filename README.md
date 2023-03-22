# chrome-extension-fast-storage

> The 'chrome.local.storage' used by the chrome extension works async. with this library you can use it without async.
> With this package, you do not need to use async when you are going to pull data from storage. Only 1 instance is always kept in the background.

## Install

```
npm install chrome-extension-fast-storage
yarn add chrome-extension-fast-storage
```

## Usage

Example usage is as follows.

### To call the package

```
import ChromeStorage from "chrome-extension-fast-storage";
```

### To listen to the changes on the storage

```
ChromeStorage.listen((storage) => {
  console.log("storage changes", storage);
});
```

### To save a data on storage

```
ChromeStorage.set({ timer: 1 });
```

### To read data from storage

```
console.log(ChromeStorage.get("timer"));
```

### To read all data on the storage

```
console.log(ChromeStorage.getAll());
```

## License

MIT (c) Abdullah Dalgıç
