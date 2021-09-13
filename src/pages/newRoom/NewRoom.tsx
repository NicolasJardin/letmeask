import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import './NewRoom.scss'
import logoImg from '../../assets/images/logo.svg'
import illustrationImg from '../../assets/images/illustration.svg'
import { Button } from '../../components/button/Button'
import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

export function NewRoom() {
  const { user } = useAuth()
  const [roomName, setRoomName] = useState('')
  const history = useHistory()

  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault()

    if (roomName.trim() === '') {
      return
    }

    const databaseRef = database.getDatabase()
    const roomRef = database.ref(databaseRef, 'rooms')

    const firebaseRoom = await database.push(roomRef)
    database.set(firebaseRoom, {
      title: roomName,
      authorId: user?.id
    })

    history.push(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div className='new-room'>
      <aside>
        <img src={illustrationImg} alt='Ilustração perguntas e respostas' />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='new-room__main-content'>
          <img src={logoImg} alt='Letmeask' />
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type='text'
              placeholder='Digite o nome da sala'
              value={roomName}
              onChange={event => setRoomName(event.target.value)}
            />
            <Button type='submit'>Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to='/'>Clique Aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
