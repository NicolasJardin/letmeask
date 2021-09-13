import './Room.scss'
import logoImg from '../../assets/images/logo.svg'
import { Button } from '../../components/button/Button'
import { RoomCode } from '../../components/roomCode/RoomCode'
import { useParams } from 'react-router'
import { useState, FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'
import { Question } from '../../components/question/Question'
import { useRoom } from '../../hooks/useRoom'
import { Actions, QuestionAction } from '../../components/questionAction/QuestionAction'
import { remove } from '@firebase/database'

type RoomParams = {
  id: string
}

export function Room() {
  const { user } = useAuth()
  const [newQuestion, setNewQuestion] = useState('')

  const databaseRef = database.getDatabase()
  const params = useParams<RoomParams>()

  const { questions, title } = useRoom(params.id)

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    const roomRef = database.ref(databaseRef, `rooms/${params.id}/questions`)
    await database.push(roomRef, question)

    setNewQuestion('')
  }

  const handleLikeQuestion = async (questionId: string, likeId: string | undefined) => {
    if (likeId) {
      const like = database.ref(
        databaseRef,
        `/rooms/${params.id}/questions/${questionId}/likes/${likeId}`
      )

      remove(like)
    } else {
      const newLike = database.ref(databaseRef, `/rooms/${params.id}/questions/${questionId}/likes`)
      await database.push(newLike, {
        authorId: user?.id
      })
    }
  }

  return (
    <div className='room'>
      <header>
        <div className='room__header'>
          <img className='room__logo' src={logoImg} alt='Letmeask' />
          <RoomCode code={params.id} />
        </div>
      </header>
      <main className='room__content'>
        <div className='room__title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
        </div>

        <form className='room__form' onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          />

          <div className='room__form-footer'>
            {user ? (
              <div className='room__user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>Faça seu login</button>.
              </span>
            )}
            <Button type='submit' disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        <div className='room__question-list'>
          {questions.map(question => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isHighlighted={question.isHighlighted}
              isAnswered={question.isAnswered}
            >
              {!question.isAnswered && (
                <QuestionAction
                  question={question}
                  action={Actions.LIKE}
                  onClick={() => handleLikeQuestion(question.id, question.likeId)}
                />
              )}
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}
