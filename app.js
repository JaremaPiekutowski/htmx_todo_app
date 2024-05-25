import express from 'express';

const courseGoals = [];

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
          <ul id="goals">
          ${courseGoals
            .map(
              (goal) => `
            <li id="goal-${goal.id}">
              <span>${goal.text}</span>
              <button
                hx-delete="/goals/${goal.id}"
                hx-target="#goal-${goal.id}"
                hx-swap="outerHTML">
                  Remove
              </button>
            </li>
          `)
            .join('')}
          </ul>
        </section>
      </main>
    </body>
  </html>
  `);
});


app.post('/add', (req, res) => {
  console.log(req.body);
  const goalText = req.body.goalText;
  const id = new Date().getTime().toString();
  const goal = { text: goalText, id: id };
  courseGoals.push(goal);
  console.log(courseGoals);
  res.send(`
        <li id="goal-${goal.id}">
        <span>${goal.text}</span>
        <button
          hx-delete="/goals/${goal.id}"
          hx-target="#goal-${goal.id}"
          hx-swap="outerHTML"
          >
            Remove
        </button>
        </li>
      `);
});

app.delete('/goals/:id', (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  const index = courseGoals.findIndex((goal) => goal.id === id);
  courseGoals.splice(index, 1);
  res.send();
});

app.listen(3000);
