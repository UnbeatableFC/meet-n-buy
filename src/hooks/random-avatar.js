export const randomAvatar = () => {
  const seed = Math.floor(Math.random() * 1000) || 20;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};
