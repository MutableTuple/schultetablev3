export const getRandomUsers = (userList, count = 3) => {
  const shuffled = [...userList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
export const trackGAEvent = (action, label) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: "GameDataModal",
      event_label: label,
    });
  }
};
