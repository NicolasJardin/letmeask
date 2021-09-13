import { ReactNode } from 'react'
import './Question.scss'

type QuestionProps = {
  content: string
  author: {
    name: string
    avatar: string
  }
  children?: ReactNode
  isAnswered?: boolean
  isHighlighted?: boolean
}

export function Question(props: QuestionProps) {
  return (
    <div
      className={`question ${props.isAnswered ? 'question--answered' : ''} ${
        props.isHighlighted && !props.isAnswered ? 'question--highlighted' : ''
      }`}
    >
      <p>{props.content}</p>
      <footer>
        <div className='question__user-info'>
          <img src={props.author.avatar} alt={props.author.name} />
          <span className={`question${props.isHighlighted ? '--highlighted' : ''}__author-name`}>
            {props.author.name}
          </span>
        </div>
        <div>{props.children}</div>
      </footer>
    </div>
  )
}
