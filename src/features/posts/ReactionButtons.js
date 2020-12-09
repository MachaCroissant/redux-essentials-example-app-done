import React from 'react'
import { useDispatch } from 'react-redux'
import { reactionAdded } from './postsSlice' 

const reactionEmoji = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀'
}

export const ReactionButtons = ({ post }) => {
    const dispatch = useDispatch()
    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        // 这里因为传入的emoji和name没有加[]括号，导致没有办法运行
        // The Object.entries() method returns an array of a given object's own enumerable string-keyed property [key, value] pairs
        // 这是因为Object.entries的返回值是一个数组

        return (

            <button 
            key={name} 
            type="button" 
            className="muted-button reaction-button"
            onClick={() => dispatch(reactionAdded({postId: post.id, reaction: name}))
            }
            >
            {emoji} {post.reactions[name]}

            </button>
        )
    })

    return <div>{reactionButtons}</div>
}