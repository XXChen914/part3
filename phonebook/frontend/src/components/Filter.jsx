const Filter = ({ setFilter, filter }) => {
  return (
    <div>
      Filter shown with
      <input
        onChange={({ target }) => setFilter(target.value)}
        value={filter}
      />
    </div>
  );
};

export default Filter;
