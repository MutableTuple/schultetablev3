export const getRandomUsers = (userList, count = 3) => {
  const shuffled = [...userList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
