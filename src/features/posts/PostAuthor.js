import React from 'react'
import {useSelector} from 'react-redux'
// Any component that needs to read data from the Redux store can use the useSelector hook, and extract the specific pieces of data that it needs. 
import {selectUsersById} from '../users/usersSlice'

export const PostAuthor = ({ userId }) => {

    // const author = useSelector(state =>
    //     state.users.find( user => user.id === userId)
    //     )
    const author = useSelector((state) => selectUsersById(state, userId))


        return <span>by { author ? author.name : 'unknown author'}</span>
}