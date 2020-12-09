const getRepoDetailsStarted = () => ({
    type: 'repoDetails/fetchStarted'
  })
  const getRepoDetailsSuccess = repoDetails => ({
    type: 'repoDetails/fetchSucceeded',
    payload: repoDetails
  })
  const getRepoDetailsFailed = error => ({
    type: 'repoDetails/fetchFailed',
    error
  })
// 以上每一个request都需要不同的type，且每一个action type都需要有对应的creator function
 
  const fetchIssuesCount = (org, repo) => async dispatch => {
    dispatch(getRepoDetailsStarted())
    // A "start" action is dispatched before the request, to indicate that the request is in progress. This may be used to track loading state to allow skipping duplicate requests or show loading indicators in the UI.
    try {
        // The async request is made
        // 依据返回的结果看是success还是fail
      const repoDetails = await getRepoDetails(org, repo)
      dispatch(getRepoDetailsSuccess(repoDetails))
    } catch (err) {
      dispatch(getRepoDetailsFailed(err.toString()))
    }
  }
  // 以上是一个thunk，需要明确actions的顺序
