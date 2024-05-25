import express from 'express';

const courseGoals = [];

function renderGoalListItem(id, text) {
  return `
    <li>
      <span>${text}</span>
      <button
        hx-delete="/goals/${id}"
        hx-target="closest li"
        hx-confirm="Are you sure you want to remove this goal?"
        >
          Remove
      </button>
    </li>
  `;
}

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Learn HTMX</title>
      <link rel="stylesheet" href="/main.css" />
      <script src="/htmx.js" defer></script>
    </head>
    <body>
      <main>
        <h1>Manage your course goals</h1>
        <section>
          <form
            id="goal-form"
            hx-post="/add"
            hx-target="#goals"
            hx-swap="beforeend">
            <div>
              <label htmlFor="goal">Goal</label>
              <input type="text" id="goalText" name="goalText" />
            </div>
            <button type="submit">Add goal</button>
          </form>
        </section>
        <section>
          <ul id="goals"
            hx-swap="outerHTML">
          ${courseGoals
            .map(
              (goal) => renderGoalListItem(goal.id, goal.text)
            ).join('')}
          </ul>
        </section>
      </main>
    </body>
  </html>
  `);
});


app.post('/add', (req, res) => {
  const goalText = req.body.goalText;
  const id = new Date().getTime().toString();
  const goal = { text: goalText, id: id };
  courseGoals.push(goal);
  res.send(renderGoalListItem(id, goalText));
});

app.delete('/goals/:id', (req, res) => {
  const id = req.params.id;
  const index = courseGoals.findIndex((goal) => goal.id === id);
  courseGoals.splice(index, 1);
  res.send();
});

app.listen(3000);
