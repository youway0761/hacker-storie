import React from "react";
import axios from "axios";
import styles from './App.module.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

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

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  //const [stories, setStories] = React.useState([]);
  //const [isLoading, setIsLoading] = React.useState(false);
  //const [isError, setIsError] = React.useState(false);

  //React.useEffect(() => {
  const handleFetchStories = React.useCallback(async () => {
    //if (searchTerm === '') return;
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories(); // C
  }, [handleFetchStories]); // D

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  //const searchedStories = stories.data.filter((story) =>
  //story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit} className={styles.searchForm}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <button type="submit" disabled={!searchTerm} className={`${styles.button} ${styles.buttonLarge}`}>
      Submit
    </button>
  </form>
);

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
      <label htmlFor={id} className={styles.label}>{children}</label>
      &nbsp;
      {/*B*/}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        //autoFocus={isFocused}
        onChange={onInputChange}
        className={styles.input}
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
    <div className={styles.item}>
      <span style={{ width: '40%' }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
        <button type="button" onClick={() => onRemoveItem(item)} className={`${styles.button} ${styles.buttonSmall}`}>
          Dismiss
        </button>
      </span>
    </div>
  );
};
export default App;
