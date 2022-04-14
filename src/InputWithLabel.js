import React from "react";
import styles from "./App.module.css";

const InputWithLabel = ({ id, type = 'text', value, onInputChange, isFocused, children, }) => {
    const inputRef = React.useRef();

    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused, inputRef.current]);

    return (
        <>
            <label htmlFor={id} className={styles.label}>{children}</label>
            &nbsp;
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

export default InputWithLabel;