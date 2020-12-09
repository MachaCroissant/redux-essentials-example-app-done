import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Link } from 'react-router-dom'

import {PostAuthor} from './PostAuthor'
import {TimeAgo} from './TimeAgo'
import {ReactionButtons} from './ReactionButtons'

import {selectAllPosts, fetchPosts, selectPostById, selectPostIds} from './postsSlice'



let PostExcerpt = ( {postId} ) => {
    const post = useSelector((state) => selectPostById(state, postId))
    return (
        <article className="post-excerpt" key={post.id}>
        <h3>{post.title}</h3>
        <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content.substring(0, 100)}</p>
        <ReactionButtons post={post} />
        <Link to={`/posts/${post.id}`} className="button muted-button">
            View Post
        </Link>
        </article>
        
    )
}

// 官方文档中提供的几个方法之一
PostExcerpt = React.memo(PostExcerpt)
//will ensure that the component inside of it only re-renders if the props have actually changed. 






export const PostList = () => {
    const dispatch = useDispatch()

    // const posts = useSelector( selectAllPosts)
    const orderedPostIds = useSelector(selectPostIds)

    const postStatus = useSelector(state => state.posts.status)
    //postStatus的存在确保了我们只fetch一次api中的list
    // 不要再渲染UI的render函数中去fetch
    
    const error = useSelector(state => state.posts.error)

    useEffect(() => {
        if(postStatus === 'idle'){
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    

    // 这是没有使用thunk以及api之前的渲染
    // const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))
    // const renderedPosts = orderedPosts.map( post => {
    //     return(
    //     <article className="post-excerpt" key={post.id}>
    //     <h3>{post.title}</h3>
    //     <div>
    //     <PostAuthor userId={post.user} />
    //     <TimeAgo timestamp={post.date} />
    //     </div>
    //     <p className="post-content">{post.content.substring(0, 100)}</p>
    //     <ReactionButtons post={post} />
    //     <Link to={`/posts/${post.id}`} className="button muted-button">
    //         View Post
    //     </Link>
    //     </article>
    //     )
    // })

    
    let content

    if(postStatus === 'loading'){
        content = <div className="loader">Loading...</div>
    } else if(postStatus === 'succeeded'){
        // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

        content = orderedPostIds.map((postId) => (
            <PostExcerpt key={postId} postId={postId} />
        ))
    }else if (postStatus === 'error'){
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
        <h2>Posts</h2>
        {/* {renderedPosts} */}
        {/* 没有使用thunk以及api之前的渲染 */}
        {content}
        </section>
    )
    // 现在定义完了这个组件，需要把它添加到App.js中去
}

// 整个数据流的操作流程如下
// adding slices of state
// writing reducer functions
// dispatching actions
// rendering the ui based on data from the redux store