/*!
 * chrome-extension-storage.js - The fastest storage structure in chrome extension
 * Copyright(c) 2023 Abdullah Dalgic
 * MIT Licensed
 */

export type IChromeStorageListen = (
  storage: any,
  changes?: { [key: string]: chrome.storage.StorageChange }
) => void;

class ChromeStorageClass {
  /**
   * Storage object
   */
  protected storage: any = {};

  /**
   * Externally added listeners that should work when there is a change in the stored object are kept in this array.
   */
  protected Observer: IChromeStorageListen[] = [];

  /**
   * Singleton instance
   */
  protected static instance: ChromeStorageClass;

  protected constructor() {
    // console.log("ChromeStorage constructor");
    chrome.storage.local.get((result) => (this.storage = result));
    chrome.storage.onChanged.addListener(this.listener);
  }

  public static getInstance(): ChromeStorageClass {
    if (!ChromeStorageClass.instance) {
      ChromeStorageClass.instance = new ChromeStorageClass();
    }

    return ChromeStorageClass.instance;
  }

  /**
   * It is used to listen externally that there is a change in the storage object.
   * @example ChromeStorage.listen((storage) => console.log("storage has changed", storage));
   * @param callback It is a function that will be called every time the storage changes. It takes the `storage` parameter in it.
   */
  public listen = (callback: IChromeStorageListen) => {
    this.Observer.push(callback);
  };

  /**
   * Get all storage
   * @returns {Object} all storage
   */
  public getAll(): any {
    return this.storage;
  }

  /**
   * Get storage by key
   * @param [key] The key of the storage you want to call
   * @returns
   */
  public get(key: string): any {
    return this.storage[key] ?? null;
  }

  /**
   * Set storage
   * @param data It must be of type object.
   */
  public set(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage = { ...this.storage, ...data };
      try {
        chrome.storage.local.set(data, () => {
          return resolve();
        });
      } catch (error) {
        // Logger.info("ChromeStorage set error", error);
        this.appReload();
        return reject(error);
      }
    });
  }

  /**
   * Clear storage
   * @returns {void}
   */
  public clear(): void {
    this.storage = {};
    if (typeof chrome.storage === "undefined") return;
    try {
      chrome.storage.local.clear();
    } catch (error) {
      // Logger.info("ChromeStorage clear error", error);
      this.appReload();
    }
  }

  /**
   * this part is under construction
   * Reload the app
   * @returns {void}
   */
  protected appReload = (): void => {
    // if (typeof window !== "undefined") window.location.reload();
  };

  /**
   * It was used to keep the changes on the storage up to date on the instance.
   * @param changes
   * @param areaName
   */
  protected listener = (changes: any, areaName: any) => {
    try {
      Object.keys(changes).forEach((key) => {
        this.storage[key] = changes[key].newValue;
      });
      // console.log("ChromeStorage changes", changes);
      this.Observer.forEach((observer) => observer(this.storage));
    } catch (error) {
      // Logger.info("ChromeStorage listener error", error);
      this.appReload();
    }
  };
}

/**
 * ChromeStorage is a class that is used to store data in the extension.
 * It is designed to work in a way that is not async.
 *
 * @example ChromeStorage.set({ timer: 1 });
 * @example ChromeStorage.get("timer");
 * @example ChromeStorage.getAll();
 * @example ChromeStorage.listen((storage) => console.log("storage changes", storage));
 */
export default ChromeStorageClass.getInstance();
