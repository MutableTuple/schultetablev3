const mentionStyle = {
  control: {
    backgroundColor: "#fff",
    fontSize: 14,
    borderRadius: "0.5rem",
  },
  "&multiLine": {
    control: {
      minHeight: 40,
    },
    highlighter: {
      padding: 9,
    },
    input: {
      padding: 9,
      minHeight: 40,
    },
  },
  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid #ccc",
      fontSize: 14,
      maxHeight: 150,
      overflowY: "auto",
    },
    item: {
      padding: "5px 10px",
      borderBottom: "1px solid #eee",
      "&focused": {
        backgroundColor: "#f3f4f6",
      },
    },
  },
};

export default mentionStyle;
