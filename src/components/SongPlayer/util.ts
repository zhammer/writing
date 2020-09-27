export function isMobile(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

export function unique<T, K>(items: T[], getKey: (T) => K): T[] {
  let set = new Set<K>();
  let out: T[] = [];

  items.forEach((item) => {
    let key = getKey(item);
    if (set.has(key)) {
      return;
    }

    set.add(key);
    out.push(item);
  });

  return out;
}
