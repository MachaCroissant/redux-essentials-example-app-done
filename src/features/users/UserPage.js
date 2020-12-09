import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {selectUsersById} from '../users/usersSlice'
import {selectAllPosts, selectPostsByUser} from '../posts/postsSlice'


export const UserPage = ({ match }) => {
    const {userId} = match.params

    const user = useSelector(state => selectUsersById(state, userId))

    // const postForUser = useSelector(state => {
    //     const allPosts = selectAllPosts(state)
    //     return allPosts.filter(post => post.user === userId)
    // })
    // // We know that useSelector will re-run every time an action is dispatched, and that it forces the component to re-render if we return a new reference value.
    // // 首先，在UserPage点击了Refresh Notifications按钮，与这个行为无关的UserPage仍然会导致useSelector在运行一遍
    // // 其次，因为我们在useSelector内部使用了allPosts.filter，就算allPosts是不变的，但是每一次filter的结果的reference是不一样的，所以总会重新渲染

    const postForUser = useSelector(state => selectPostsByUser(state,userId))
    const postTitles = postForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return (
        <section>
            <h2>{user.name}</h2>

            <ul>{postTitles}</ul>
        </section>
    )
}