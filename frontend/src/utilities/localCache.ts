/************* Helper func for data cache ****************/
export const setCacheWithExpiry = (key: string, value: any): void => {
  const oldItem = localStorage.getItem(key);

  let expiry;

  if (oldItem) {
    const parsed = JSON.parse(oldItem);
    expiry = parsed.expiry; // keep old expiry
  } else {
    const now = Date.now();
    expiry = now + 24 * 60 * 60 * 1000; // set fresh expiry on first save: 25hrs
  }

  const item = {
    value,
    expiry,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

export const getCacheWithExpiry = (key: string): any | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = Date.now();

  if (now > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

export const removeCacheData = (key: string): any | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  localStorage.removeItem(key);
};
