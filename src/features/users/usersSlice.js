import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'


const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('fakeApi/users')
    return response.users
})




const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    //只要reducer是空的，就不可能会有数据的更新

    extraReducers: {
        [fetchUsers.fulfilled]: usersAdapter.setAll
        // (state, action) => {return action.payload}
    }
})


export default userSlice.reducer

// export const selectAllUsers = state => state.users
// export const selectUsersById = (state, userId) => state.users.find( user => user.id === userId)


export const {
    selectAll: selectAllUsers,
    selectById: selectUsersById
} = usersAdapter.getSelectors(state => state.users)