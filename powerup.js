const TrelloPowerUp = window.TrelloPowerUp;

// Trello capabilities
TrelloPowerUp.initialize({
  "card-badges": function (t, options) {
    return t.get("card", "shared", "done", false).then((isDone) => {
      return isDone
        ? [{ text: "✅ Done", color: "green" }]
        : [];
    });
  },
  "list-sorters": function (t, options) {
    return [
      {
        text: "Progress",
        callback: function (t, opts) {
          return t.board("all").then((board) => {
            let lists = board.lists;
            let sortedLists = lists.sort((a, b) => {
              return a.cards.length - b.cards.length;
            });
            return { sortedLists };
          });
        },
      },
    ];
  },
  "list-header-buttons": function (t, options) {
    return t.list("all").then((list) => {
      return t.cards("all").then((cards) => {
        let totalTasks = cards.length;
        let doneTasks = cards.filter((card) =>
          t.get(card.id, "shared", "done", false)
        ).length;
        let progress = totalTasks ? (doneTasks / totalTasks) * 100 : 0;

        return [
          {
            icon: "https://image-url.com/progress-icon.png",
            text: `${doneTasks}/${totalTasks} tasks complete` +
              ` (${Math.round(progress)}%)`,
            callback: function (t) {
              t.alert({ message: "List progress updated!" });
            },
          },
        ];
      });
    });
  },
});

// Function to add 'Done' button to each card
TrelloPowerUp.initialize({
  "card-buttons": function (t, options) {
    return [
      {
        icon: "https://image-url.com/done-icon.png",
        text: "Mark as Done",
        callback: function (t) {
          return t.get("card", "shared", "done", false).then((isDone) => {
            return t.set("card", "shared", "done", !isDone).then(() => {
              t.alert({
                message: isDone ? "Marked as Not Done" : "Marked as Done",
              });
            });
          });
        },
      },
    ];
  },
});
