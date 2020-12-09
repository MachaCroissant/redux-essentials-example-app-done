import { createAsyncThunk, createSlice, nanoid, createSelector } from '@reduxjs/toolkit'
import { sub } from 'date-fns'
import { StaticRouter } from 'react-router-dom'
import { client } from '../../api/client'


import {createEntityAdapter} from '@reduxjs/toolkit'

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null
})

// const initialState = {
//     posts: [],
//     status: 'idle',
//     error: null
// }

//createAsyncThunk接受两个参数，第一个是用于描述generatoed action type的字符串前缀
// 第二个参数是一个payload creator callback function，这个函数会返回一个函数有些数据的promise，或者是rejected promise
// 为什么不用poromise和then的形式？而采用async await这样看是同步的逻辑？因为同时还需要使用try catch逻辑快
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ()=> {
    const response = await client.get('/fakeApi/posts')
    return response.posts
})


export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    async initialPost => {
        const response = await client.post('/fakeApi/posts', {post: initialPost})
        return response.post
    }
)



// 创建一个新的slice，我们需要把这个slice的reducer function添加到全局的store
// 因此最终export的对象是调用createSlice之后的reducer对象
const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        //our action object just contains the minimum amount of information needed to describe what happened.

        
        // postAdded: {
        //     reducer(state, action){
        //         // state都是immutable的，也就是不可变的，实际上createSlice实现了先复制原state，在更改复制对象，最后更新的操作
        //         // createSlice() converts those mutations into safe immutable updates internally using the Immer library
        //         state.posts.push(action.payload)
        //         // 注意postslice中的state对象是这个name field中所有的数据
        //         // 并不是entire redux state object
        //         // action的payload对象就是state的数据形式，和initialstate的两个花括号里的内容一致
    
        //     },
        //     // prepare callback
        //     // return an object with the payload field inside. 
        //     // (The return object may also contain a meta field, which can be used to add extra descriptive values to the action, and an error field, which should be a boolean indicating whether this action represents some kind of an error.)
        //     prepare(title, content, userId){
        //         return {
        //             payload: {
        //                 id: nanoid(),
        //                 date: new Date().toISOString(),
        //                 title,
        //                 content,
        //                 user: userId,
        //                 reactions: {
        //                     thumbsUp: 0,
        //                     hooray: 0,
        //                     heart: 0,
        //                     rocket: 0,
        //                     eyes: 0,
        //                   },
                        
        //             }
        //         }
        //     }
        // },


        // 给reducers对象添加一个新的函数，这个函数名称清晰描述了发生了什么行为
        // 为了实现这个reducer的函数，我们所需要的数据就是该reducer对应的action的payload
        // That means the action object will look like {type: 'posts/postUpdated', payload: {id, title, content}}
        postUpdated(state, action){
            const { id, title, content } = action.payload
            const existingPost = state.entities[id]
            // const existingPost = state.posts.find(post => post.id === id)
            if(existingPost){
                existingPost.title = title
                existingPost.content = content
            }
        },

        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            // const existingPost = state.posts.find(post => post.id === postId)
            if(existingPost) {
                existingPost.reactions[reaction]++
                // seems like mutating logic however obtaining by using createSlice && Immer library
            }
        }
    },

    extraReducers: {
        [fetchPosts.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.status ='succeeded'
            postsAdapter.upsertMany(state, action.payload)
            // state.posts = state.posts.concat(action.payload)
        },
        [fetchPosts.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
        // 不像fecthPost把所有阶段都放在slice中处理，addNewPost把部分请求阶段放在了UI中，jianAddPostForm
        [addNewPost.fulfilled]: postsAdapter.addOne
        // (state, action) => {
        //     state.posts.push(action.payload)
        // }
    }
})

//当我们写了一个名为postAdded的ReducerFunction时，createSlice会自动生成一个
// 有同样名字的action creator function，这个action就相当于一个事件，可以连结到UI component中，有点类似于onclick
export const { postAdded, postUpdated, reactionAdded } = postSlice.actions
// export the action creator function that createSlice generated for us
export default postSlice.reducer

// 至今为止讨论的所有的内容都是reducers和UI之间的互动
// 如果这个slice中的reuder要和其他slice的reducer互动呢？可以使用slice中的extraReducers field




export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    // The generated selector functions are always called selectAll and selectById
    selectIds: selectPostIds
    // 左边createEntity？函数getSelector自动生成的selector
    // 右边是我们希望这些自动生成的selector被export到UI component中去使用的名字
} = postsAdapter.getSelectors(state => state.posts)



// 如果要手写action creator该怎么写？
// createSlice是手写action creator的替代

function postAdded2(title, content) {
    const id = nanoid()
    // 如果id是随机产生的，一定要先产生，再把它放到return的action对象中去
    return{
        type: 'posts/postAdded',
        payload: { id, title, content}
    }
}
// 虽然createSlice给了更方便产出action creators，但是我们仍然需要createSlice中自定义action.payload

// // 在slice内部定义selector，这样当slice中的数据形式发生改变的时候，就没必要总修改UI当中收取的数据形式
// export const selectAllPosts = state => state.posts.posts
// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)
// // 这写slector中作为参数的state是root redux object
// // 完成此处的定义之后在UI中import这些内容，我们想要定义slector也是因为UI中存在重复代码


// 为了防止useSelector在每一次全体app有一个action发生就重新运行的特性，使用createSelector
// Reselect is a library for creating memoized selector functions，
//  It has a createSelector function that generates memoized selectors that will only recalculate results when the inputs change 
export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
)
// 第一个参数是由多个selector函数的返回值组成的数组
// 第二个参数接受前一个参数返回的结果数组作为输入
// 在调用这个函数的时候传入的参数就是第一个参数重的selector函数们接受的参数




