const Persons = ({ persons, removePerson }) => {
  return (
    <div>
      {persons.map(p => (
        <p key={p.id}>
          {p.name} {p.number}
          <button onClick={() => removePerson(p)}>delete</button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
