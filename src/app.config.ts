export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/food/index',
    'pages/challenge/index',
    'pages/record/index',
    'pages/reward/index',
    'pages/activity/index',
    'pages/project-select/index',
    'pages/food-detail/index',
    'pages/task-detail/index',
    'pages/share/index',
    'pages/comfort/index',
    'pages/activity-manage/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF7A9E',
    navigationBarTitleText: '恢复星球',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF5F7'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#FF7A9E',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '恢复首页'
      },
      {
        pagePath: 'pages/food/index',
        text: '食物查询'
      },
      {
        pagePath: 'pages/challenge/index',
        text: '每日挑战'
      },
      {
        pagePath: 'pages/record/index',
        text: '拍照记录'
      },
      {
        pagePath: 'pages/reward/index',
        text: '奖励中心'
      }
    ]
  }
})
