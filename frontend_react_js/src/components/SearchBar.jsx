import React, { useId } from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * PUBLIC_INTERFACE
 * SearchBar renders a compact search input used to filter tasks in-place.
 */
export default function SearchBar({ value, onChange, placeholder = 'Search tasks…' }) {
  /** This is a public component that provides a styled, accessible search field. */
  const id = useId();

  return (
    <div className="searchWrap">
      <label className="srOnly" htmlFor={id}>
        Search tasks
      </label>
      <span className="searchIcon" aria-hidden="true">
        <FiSearch />
      </span>
      <input
        id={id}
        className="input inputSearch"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
