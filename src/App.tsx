import { useEffect, useState, useRef } from 'react'
import './App.css'
import { type User } from './types'
import { UsersList } from './UsersList/components/UsersList'

const App = () => {
  const [users, setusers] = useState<User[]>([])
  const [showColors, setshowColors] = useState(false)
  const [sortByCountry, setsortByCountry] = useState(false)
  const [filterCountry, setfilterCountry] = useState<string | null>(null)

  // useRef es para guardar un valor que queremos que se comparta entre renderizados pero que al cambiar no vuelva a renderizar el componente
  const originalUsers = useRef<User[]>([])

  const filteredUsers = typeof filterCountry === 'string' && filterCountry.length > 0
    ? users.filter((user) => {
      return user.location.country.toLocaleLowerCase().includes(filterCountry.toLowerCase())
    })
    : users

  const sortedUsers = sortByCountry
    // .toSorted es un metodo nuevo de javascript que aun no esta disponible en todos los navegadores
    // Es un metodo que ya indica que queremos hacer una copia del estado
    ? filteredUsers.toSorted((a, b) => {
      return a.location.country.localeCompare(b.location.country)
    })
    : filteredUsers

  const toogleColors = () => {
    setshowColors(!showColors)
  }

  const toogleSortByCountry = () => {
    setsortByCountry(prevState => !prevState)
  }

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== uuid)
    setusers(filteredUsers)
  }

  const handleReset = () => {
    setusers(originalUsers.current)
  }
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(res => {
        setusers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => {
        console.log('Error al recuperar los usuarios', err)
      })
  }, [])

  return (
    <>
      <div className='app'>
        <h1>Prueba Técnica</h1>
        <header style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <button onClick={toogleColors}>
            Colorear Filas
          </button>

          <button onClick={toogleSortByCountry}>
            {sortByCountry ? 'No ordenar por país' : 'Ordenar por país'}
          </button>

          <button onClick={handleReset}>
            Reset Users
          </button>

          <input placeholder='Filter by country' onChange={(evt) => {
            setfilterCountry(evt.target.value)
          }} />
        </header>
        <main>
          <UsersList users={sortedUsers} showColors={showColors} deleteUser={handleDelete} />
        </main>
      </div >
    </>
  )
}

export default App
