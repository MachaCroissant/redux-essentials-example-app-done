import { configureStore } from '@reduxjs/toolkit'
import postReducer from '../features/posts/postsSlice'
//从postsSlice中import的对象我们给它起了一个postReducer的
import usersReducer from '../features/users/usersSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
//configureStore用来储存所有state及其reducer
// postsReducer作为a reducer field传递到变量posts中去
// 这个posts变量是state的一个子对象，可以通过state.posts来访问。
// state posts会通过postsReducer function来更新
// 有了data在store之后，可以开始组件一个React Component了，赚到postList.js
export default configureStore({
  reducer: {
    posts: postReducer,
    users: usersReducer,
    notifications: notificationsReducer
  }
})
