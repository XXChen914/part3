const PersonForm = ({ addPerson, setNewPerson, newPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        Name: 
        <input
          onChange={({ target }) => {
            setNewPerson(prev => ({ ...prev, name: target.value }));
          }}
          value={newPerson.name}
        />
      </div>
      <div>
        Number: 
        <input
          onChange={({ target }) => {
            setNewPerson(prev => ({ ...prev, number: target.value }));
          }}
          value={newPerson.number}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
