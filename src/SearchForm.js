import React from "react";
import InputWithLabel from "./InputWithLabel";
import { StyledButtonLarge } from './style';
import styles from "./App.module.css";

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
        <StyledButtonLarge type="submit" disabled={!searchTerm}>
            Submit
        </StyledButtonLarge>
    </form>
);

export default SearchForm;