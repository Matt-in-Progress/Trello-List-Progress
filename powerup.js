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
        text: "Sort by Progress",
        callback: function (t, opts) {
          return t.board("all").then((board) => {
            let lists = board.lists;
            let sortedLists = lists.sort((a, b) => {
              let aDone = a.cards.filter((card) => t.get(card.id, "shared", "done", false)).length;
              let bDone = b.cards.filter((card) => t.get(card.id, "shared", "done", false)).length;
              return bDone - aDone; // Sort by most completed tasks
            });
            return { sortedLists };
          });
        },
      },
    ];
  },
  "list-actions": function (t, options) {
    return [{
      text: "Show Progress",
      callback: function (t) {
        return t.list("all").then((list) => {
          return t.cards("all").then((cards) => {
            let totalTasks = cards.length;
            let doneTasks = cards.filter((card) =>
              t.get(card.id, "shared", "done", false)
            ).length;
            let progressMessage = `${doneTasks}/${totalTasks} tasks complete`;
            t.alert({ message: progressMessage });
          });
        });
      },
    }];
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
