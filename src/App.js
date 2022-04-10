import React from "react";

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

/* const initialStories = [
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
]; */

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

/* const getAsyncStories = () =>
  // new Promise((resolve, reject) => setTimeout(reject, 2000));
  new Promise(resolve =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  ); */

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}


const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  //const [stories, setStories] = React.useState([]);
  //const [isLoading, setIsLoading] = React.useState(false);
  //const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    //setIsLoading(true);
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(`${API_ENDPOINT}react`) // B
      .then(response => response.json()) // C
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits, // D
        });
      })
      .catch(() =>
        //setIsError(true));
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
  }, []);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused//default isFocused = {true}
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

const InputWithLabel = ({ id, type = 'text', value, onInputChange, isFocused, children, }) => {
  // A
  const inputRef = React.useRef();

  // C
  React.useEffect(() => {
    // console.log('a');
    // console.log(isFocused);
    // console.log(inputRef.current);
    if (isFocused && inputRef.current) {
      // D
      inputRef.current.focus();
      //isFocused = true;
      //console.log('b');
      //console.log(isFocused);
      //console.log(inputRef.current);
    }
  }, [isFocused, inputRef.current]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      {/*B*/}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        //autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );
}

const List = ({ list, onRemoveItem }) =>
  list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);
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
/* const Item = ({
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
); */
const Item = ({ item, onRemoveItem }) => {
  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  );
};
export default App;
