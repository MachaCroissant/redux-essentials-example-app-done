import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit'

import {client} from '../../api/client'


const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    // 第一个参数总是a thunk creator
    // 这和createSlice方法的中的name以及reducer是一样的


    // 与前面userSlice以及postsSlice中的thunk相比
    // 这里为thunkAPI传入了参数
    // 在async函数中使用redux store提供方法：dispatch和getState方法
    async (_, {getState}) => {
        const allNotifications = selectAllNotifications(getState())
        // 从redux store中获取list of notifications，注意这是数组

        const [latestNotification] = allNotifications
        // 使用数组结构array destructing，获取返回的redux store list的第一个元素
        
        //grab the latest one using array destructuring.
        const latestTimestamp = latestNotification ? latestNotification.date : ''
        const response = await client.get(
            `/fakeApi/notifications?since=${latestTimestamp}`
        )
        return response.notifications
    }
)

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state, action) {
            // state.forEach(notification => {
            //     notification.read = true
            // })

            Object.values(state.entities).forEach(notification => {
                notification.read = true
            })
        }
    },
    extraReducers: {
        [fetchNotifications.fulfilled]: (state, action) => {
            // state.forEach(notification => {
            //     notification.isNew = !notification.read
            // })
            // state.push(...action.payload)
            // // es6扩展运算符，spread就是三个点，将一个数组转为用都好分隔的参数序列
            // // 可以替代applay方法
            // state.sort((a, b) => b.date.localeCompare(a.date))
            // // 因为sort总会mutate existing array，能在这里用它是因为这是在createSlice中
            Object.values(state.entities).forEach(notification => {
                notification.isNew = !notification.read
            })
            notificationsAdapter.upsertMany(state, action.payload)
        }
    }

})


export const { allNotificationsRead } = notificationsSlice.actions
export default notificationsSlice.reducer

// export const selectAllNotifications = state => state.notifications

export const {
    selectAll: selectAllNotifications
} = notificationsAdapter.getSelectors(state => state.notifications)