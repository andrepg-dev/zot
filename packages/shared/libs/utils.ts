export const emailTransform = (val: any) => {
  if (!val) return undefined;
  if (val.startsWith("http://") || val.startsWith("https://")) {
    return val;
  }
  return `https://${val.replace(/^\/+/, "")}`;
};
