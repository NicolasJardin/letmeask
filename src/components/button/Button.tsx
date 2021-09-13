import React, { ButtonHTMLAttributes } from 'react'
import './Button.scss'

type DefaultButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

type CustomButtonProps = {
  variant?: string
  isOutLined?: boolean
}

type ButtonProps = DefaultButtonProps & CustomButtonProps

export function Button({ variant, isOutLined = false, ...props }: ButtonProps) {
  return (
    <button
      className={`button ${variant ? 'button--' + variant : ''} 
      ${isOutLined ? 'button--outlined' : ''}`}
      {...props}
    ></button>
  )
}
