import { useEffect, useState } from 'react'
import './App.css'
import { type User } from './types'
import { UsersList } from './UsersList/components/UsersList'

const App = () => {
  const [users, setusers] = useState<User[]>([])
  const [showColors, setshowColors] = useState(false)
  const [sortByCountry, setsortByCountry] = useState(false)

  const toogleColors = () => {
    setshowColors(!showColors)
  }

  const toogleSortByCountry = () => {
    setsortByCountry(prevState => !prevState)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(res => {
        setusers(res.results)
      })
      .catch(err => {
        console.log('Error al recuperar los usuarios', err)
      })
  }, [])

  const sortedUsers = sortByCountry
    // .toSorted es un metodo nuevo de javascript que aun no esta disponible en todos los navegadores
    // Es un metodo que ya indica que queremos hacer una copia del estado
    ? users.toSorted((a, b) => {
      return a.location.country.localeCompare(b.location.country)
    })
    : users

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
        </header>
        <main>
          <UsersList users={sortedUsers} showColors={showColors} />
        </main>
      </div >
    </>
  )
}

export default App
