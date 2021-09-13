import './AdminRoom.scss'
import logoImg from '../../assets/images/logo.svg'

import { Button } from '../../components/button/Button'
import { RoomCode } from '../../components/roomCode/RoomCode'
import { useHistory, useParams } from 'react-router'
import { database } from '../../services/firebase'
import { Question } from '../../components/question/Question'
import { useRoom } from '../../hooks/useRoom'
import { Actions, QuestionAction } from '../../components/questionAction/QuestionAction'
import { remove, update } from '@firebase/database'

type AdminRoomParams = {
  id: string
}

export function AdminRoom() {
  const databaseRef = database.getDatabase()
  const params = useParams<AdminRoomParams>()
  const history = useHistory()
  const { questions, title } = useRoom(params.id)

  const handleEndRoom = async () => {
    const roomRef = database.ref(databaseRef, `rooms/${params.id}`)
    await update(roomRef, {
      endedAt: new Date()
    })

    history.push('/')
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Você tem certeza que deseja excluir esta pergunta?')) {
      const questionRef = database.ref(databaseRef, `rooms/${params.id}/questions/${questionId}`)
      await remove(questionRef)
    }
  }

  const handleCheckQuestionAsAnswered = async (questionId: string) => {
    const questionRef = database.ref(databaseRef, `rooms/${params.id}/questions/${questionId}`)
    await update(questionRef, {
      isAnswered: true
    })
  }

  const handleHighlightQuestion = async (questionId: string) => {
    const questionRef = database.ref(databaseRef, `rooms/${params.id}/questions/${questionId}`)
    await update(questionRef, {
      isHighlighted: true
    })
  }

  return (
    <div className='admin-room'>
      <header>
        <div className='admin-room__header'>
          <img className='admin-room__logo' src={logoImg} alt='Letmeask' />
          <div>
            <RoomCode code={params.id} />
            <Button onClick={handleEndRoom} isOutLined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main className='admin-room__content'>
        <div className='admin-room__title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
        </div>
        <div className='admin-room__question-list'>
          {questions.map(question => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isHighlighted={question.isHighlighted}
              isAnswered={question.isAnswered}
            >
              {!question.isAnswered && (
                <>
                  <QuestionAction
                    action={Actions.CHECK}
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  />
                  <QuestionAction
                    action={Actions.HIGHLIGHT}
                    onClick={() => handleHighlightQuestion(question.id)}
                  />
                </>
              )}
              <QuestionAction
                action={Actions.DELETE_ROOM}
                onClick={() => handleDeleteQuestion(question.id)}
              />
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}
