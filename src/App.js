import React from "react";



const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || 'React');

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      <List list={searchedStories} />
    </div>
  );
}
const Search = ({ search, onSearch }) => (
  <div>
    <label htmlFor="search">Search: </label>
    <input
      id="search"
      type="text"
      value={search}
      onChange={onSearch}
    />
  </div>
);


const List = ({ list }) =>
  list.map(item => <Item key={item.objectID} item={item} />);
/* const List = ({ list }) =>
  list.map(item => (
    <Item
      key={item.objectID}
      title={item.title}
      url={item.url}
      author={item.author}
      num_comments={item.num_comments}
      points={item.points}
    />
  )); */
// list.map(item => <Item key={item.objectID} {...item} />);// 展开运算符
// list.map(({ objectID, ...item }) => <Item key={objectID} {...item} />); //剩余运算符
// const Item = ({ title, url, author, num_comments, points }) => (
const Item = ({
  item: { //item: 对Item的prop item进行解构 
    title,
    url,
    author,
    num_comments,
    points,
  },
}) => (
  <div>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </div>
);

export default App;
