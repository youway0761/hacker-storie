import React from "react";

const welcome = {
  greeting: 'Hey',
  title: 'React',
};

function getTitle(title) {
  return title;
}

const wels = ['welcome', 'to', 'React', 'world', '!']

function App() {
  let strs = '';
  for (let str of wels) {
    strs += str + ' ';
  }

  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>
      <h1>Hello {getTitle('React')}</h1>
      <h1>{wels[0]} {wels[1]} {wels[2]} {wels[3]}{wels[4]}</h1>
      <h1>{strs}</h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
