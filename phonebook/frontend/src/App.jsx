import { useEffect, useState } from 'react';
import Header from './components/Header';
import Notification from './components/Notification';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: '', number: '' });
  const [filter, setFilter] = useState('');
  const [info, setInfo] = useState({ message: '' });

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
      .catch(() => {
        notifyWith('Failed to connect to the server', 'error');
      });
  }, []);

  const notifyWith = (message, type='info') => {
    setInfo({ message, type});
    
    setTimeout(() => {
      setInfo({ message: ''});
    }, 3000);
  };

  const updatePerson = (person) => {
    if (
      window.confirm(
        `${person.name} is already added to phonebook, replace the old number?`
      )
    ) {
      personService
        .update(person.id, newPerson)
        .then(updatedPerson => {
          if (updatedPerson) {
            setPersons(
              persons.map((p) => (p.id === person.id ? updatedPerson : p))
            );
            notifyWith(` ${updatedPerson.name}'s number updated`);
          } else {
            // return null if the person has already been removed
            notifyWith(`${person.name} has already been removed !`, 'error');
            setPersons(persons.filter((p) => p.id !== person.id));
          }
        })
        .catch((error) => {
          notifyWith(error.response.data.error, 'error'); // validation error
        });
      setNewPerson({ name: '', number: '' });
    }
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personFound = persons.find(p => p.name === newPerson.name);

    if (personFound) {
      updatePerson(personFound);
      return;
    } 

    personService
      .create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson));
        setNewPerson({ name: '', number: '' });
        notifyWith(`${createdPerson.name} Added`);
      })
      .catch((error) => {
        notifyWith(error.response.data.error, 'error');
      });
  };

  const removePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .del(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
          notifyWith(`${person.name} deleted`)
        })
        .catch((error) => {
          notifyWith(error.response.data.error, 'error');
        });
    }
  };

  const personsToShow = filter
    ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <Header text={'Phonebook'} />
      <Notification info={info} />
      <Filter filter={filter} setFilter={setFilter} />
      <Header text={'Add a new'} />
      <PersonForm
        addPerson={addPerson}
        setNewPerson={setNewPerson}
        newPerson={newPerson}
      />
      <Header text={'Numbers'} />
      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  );
};

export default App;
