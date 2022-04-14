import React from 'react';
import { StyledColumn, StyledButtonSmall } from './style';
import styles from "./App.module.css";
import { ReactComponent as Check } from './check.svg';

const List = ({ list, onRemoveItem }) =>
    list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);

const Item = ({ item, onRemoveItem }) => {
    return (
        <div className={styles.item}>
            <StyledColumn width='40%'>
                <a href={item.url}>{item.title}</a>
            </StyledColumn>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span style={{ width: '10%' }}>
                <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
                    <Check height="18px" width="18px" />
                </StyledButtonSmall>
            </span>
        </div>
    );
};

export default List;