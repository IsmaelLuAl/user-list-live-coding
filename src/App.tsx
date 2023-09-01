import { useEffect, useState, useRef, useMemo } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import { UsersList } from './UsersList/components/UsersList'

const App = () => {
  const [users, setusers] = useState<User[]>([])
  const [showColors, setshowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setfilterCountry] = useState<string | null>(null)

  // useRef es para guardar un valor que queremos que se comparta entre renderizados pero que al cambiar no vuelva a renderizar el componente
  const originalUsers = useRef<User[]>([])

  const filteredUsers = useMemo(() => {
    return typeof filterCountry === 'string' && filterCountry.length > 0
      ? users.filter((user) => {
        return user.location.country.toLocaleLowerCase().includes(filterCountry.toLowerCase())
      })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
      [SortBy.COUNTRY]: user => user.location.country
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  const toogleColors = () => {
    setshowColors(!showColors)
  }

  const toogleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => user.login.uuid !== uuid)
    setusers(filteredUsers)
  }

  const handleReset = () => {
    setusers(originalUsers.current)
  }

  const handleChangeSorting = (sort: SortBy) => {
    setSorting(sort)
  }

  // Call API and get the list of users
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
        <header className='headerApp'>
          <button onClick={toogleColors}>
            Colorear Filas
          </button>

          <button onClick={toogleSortByCountry}>
            {sorting === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
          </button>

          <button onClick={handleReset}>
            Reset Users
          </button>

          <input placeholder='Filter by country' onChange={(evt) => {
            setfilterCountry(evt.target.value)
          }} />
        </header>
        <main>
          <UsersList changeSorting={handleChangeSorting} users={sortedUsers} showColors={showColors} deleteUser={handleDelete} />
        </main>
      </div >
    </>
  )
}

export default App
