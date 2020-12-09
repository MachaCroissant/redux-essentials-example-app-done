import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'

import { fetchUsers } from './features/users/usersSlice'

import './api/server'

store.dispatch(fetchUsers())
// 为什么在这里dispatch？而不是像postList中一样使用useEffect？
// 因为我们只希望获得一次用户列表，并且我们希望这个fetch在app启动的时候就完成
// 所以直接在顶层文件index.js中使用store


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
