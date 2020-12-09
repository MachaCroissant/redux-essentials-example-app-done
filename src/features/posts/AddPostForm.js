import { nanoid } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import React, { useState } from 'react'

// import { postAdded } from './postsSlice'

import { unwrapResult } from '@reduxjs/toolkit'
import { addNewPost } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'

export const AddPostForm = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')



    const users = useSelector(selectAllUsers)

    const dispatch = useDispatch()
    // 现在有两个对象，一个是用于储存数据的store，另一个是用于UI呈现的组件
    // 为了让UI组件能访问到store的dispatch function， 我们使用useDispatch hook
    // 这个函数接受dispatch function作为参数，也就是postAdded action

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)
    // 这个函数组件的功能是进行最顶层App的渲染
    // 但是数据的处理还是需要依靠store，仍然需要创建属于这个功能的reducer function

    // const onSavePostClicked = () => {
    //     if(title && content){
    //         // dispatch(
    //         //     postAdded({
    //         //         id: nanoid(),
    //         //         // 我们需要id来识别每一个post，nanoid function可以随机产生唯一的id👌
    //         //         title,
    //         //         content
    //         //         // 以上利用了useState hook的变量
    //         //     })
    //         // )
    //         dispatch(postAdded(title, content, userId))
    //         // 因为我们已经有了prepare callback，所以payload自动传过去了

    //         // 更新当前储存在useState hook中的变量
    //         setTitle('')
    //         setContent('')
    //     }
    // }


    // const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

    const usersOptions = users.map( (user) => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))


    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    const onSavePostClicked = async () => {
        if(canSave){
            try{
                setAddRequestStatus('pending')
                const resultAction = await dispatch(
                    addNewPost({title, content, user: userId})
                )
                // 因为addNewPost是在postsSlice中定义的一个thunk，他的返回结果都是final action，错误都是在内部处理的，返回一个fulfilled action或者rejected action
                // 使用unwarapResult让thunk返回的promise依据action的状态返回不同的内容
                // 针对fulfilled action返回action.payload，针对rejected action就抛出错误信息
                //这样就可以catch err了

                unwrapResult(resultAction)
                setTitle('')
                setContent('')
                setUserId('')
            } catch(err){
                console.log('Failed to save the post:', err)
            } finally{
                setAddRequestStatus('idle')
            }
        }
    }
    return(
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input 
                    type="text" 
                    id="postTitle" 
                    name="postTitle" 
                    value={title} 
                    onChange={onTitleChanged} 
                />

                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>

                <label htmlFor="postContent">Content:</label>
                <textarea 
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
            </form>
        </section>
    )
}