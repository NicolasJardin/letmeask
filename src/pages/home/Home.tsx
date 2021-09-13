import { useHistory } from 'react-router-dom'

import './Home.scss'
import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import { Button } from '../../components/button/Button'
import { useAuth } from '../../hooks/useAuth'
import { useState, FormEvent } from 'react'
import { database } from '../../services/firebase'

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')

  const handleCreateRoom = async (path: string) => {
    if (!user) {
      await signInWithGoogle()
    }

    history.push(path)
  }

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return
    }

    const databaseRef = database.getDatabase()
    const roomRef = database.ref(databaseRef, `rooms/${roomCode}`)
    const roomData = await database.get(roomRef)

    if (!roomData.exists()) {
      alert('Room does not exists.')
      return
    }

    if (roomData.val().endedAt) {
      alert('Room already closed')
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div className='home'>
      <aside>
        <img src={illustrationImg} alt='Ilustração perguntas e respostas' />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='home__main-content'>
          <img src={logoImg} alt='Letmeask' />
          <Button onClick={() => handleCreateRoom('/rooms/new')} variant='google'>
            <img src={googleIconImg} alt='Logo do google' />
            Crie sua sala com o google
          </Button>
          <div className='home__separator'>Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type='text'
              placeholder='Digite o código da sala'
              value={roomCode}
              onChange={event => setRoomCode(event.target.value)}
            />
            <Button type='submit'>Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
