import React from 'react'
import { useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import {PostAuthor} from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { selectPostById } from './postsSlice'

export const SinglePostPage = ( { match }) => {//这里用花括号是因为match是一个对象，包含URL
    const { postId } = match.params

    // const post = useSelector(state =>
    //     state.posts.find(post => post.id === postId)
    //     )
    //     // 只要useSelector的返回对象更新了，组件就会重新渲染

    const post = useSelector(state => selectPostById(state,postId))

        //验证是否正确
        if(!post){
            return(
                <section>
                    <h2>Post not found!</h2>
                </section>
            )
        }

        return(
            <section>
                <article className="post">
                <h2>{post.title}</h2>
                <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
                </div>
                <p className="post-content">{post.content}</p>
                <ReactionButtons post={post} />
                <Link to={`/editPost/${post.id}`} className="button">Edit Post</Link>
                </article>
            </section>
        )
        // 这部分其实和postList有相类似的部分，但是简易分开写。后续再extract a reusable component
}