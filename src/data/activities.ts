import { ActivityItem } from '@/types'

export const activities: ActivityItem[] = [
  {
    id: '1',
    title: '7天恢复挑战赛',
    description: '连续打卡7天，赢取双倍能量奖励！',
    image: 'https://picsum.photos/id/1015/750/400',
    startTime: '2026-06-01',
    endTime: '2026-06-30',
    rules: [
      '活动期间连续打卡7天即可获得参与奖',
      '每天完成所有任务可获得额外50能量',
      '邀请好友参与，双方各得100能量',
      '完成挑战可参与抽取终极大奖'
    ],
    rewards: [
      { id: 'r1', name: '参与奖：50能量', energyCost: 0, stock: 1000 },
      { id: 'r2', name: '全勤奖：200能量', energyCost: 0, stock: 500 },
      { id: 'r3', name: '终极大奖：免费护理一次', energyCost: 0, stock: 10 }
    ]
  },
  {
    id: '2',
    title: '美食大探索',
    description: '发现更多绿灯美食，分享你的创意食谱',
    image: 'https://picsum.photos/id/1018/750/400',
    startTime: '2026-06-15',
    endTime: '2026-07-15',
    rules: [
      '查询并收藏10种绿灯食物',
      '分享你的创意食谱到社区',
      '点赞最多的3位用户获得奖励',
      '所有参与者都能获得参与奖'
    ],
    rewards: [
      { id: 'r1', name: '参与奖：30能量', energyCost: 0, stock: 500 },
      { id: 'r2', name: '优秀奖：补水面膜一盒', energyCost: 0, stock: 10 },
      { id: 'r3', name: '创意奖：500能量', energyCost: 0, stock: 3 }
    ]
  },
  {
    id: '3',
    title: '恢复日记大赛',
    description: '记录你的恢复日记，见证美丽蜕变',
    image: 'https://picsum.photos/id/1036/750/400',
    startTime: '2026-06-20',
    endTime: '2026-07-20',
    rules: [
      '每天记录恢复心情和照片',
      '记录满21天即可参与评选',
      '内容真实，情感真挚',
      '由专业团队评选出获奖者'
    ],
    rewards: [
      { id: 'r1', name: '参与奖：100能量', energyCost: 0, stock: 200 },
      { id: 'r2', name: '最美日记：价值1000元项目券', energyCost: 0, stock: 5 },
      { id: 'r3', name: '人气日记：免费皮肤管理年卡', energyCost: 0, stock: 1 }
    ]
  },
  {
    id: '4',
    title: '闺蜜监督计划',
    description: '邀请闺蜜监督，一起变美不孤单',
    image: 'https://picsum.photos/id/1039/750/400',
    startTime: '2026-06-01',
    endTime: '2026-08-31',
    rules: [
      '生成专属监督码分享给闺蜜',
      '闺蜜扫码成为你的监督人',
      '每周闺蜜可以检查你的打卡情况',
      '双方都坚持满30天可获得奖励'
    ],
    rewards: [
      { id: 'r1', name: '闺蜜奖：双方各得200能量', energyCost: 0, stock: 300 },
      { id: 'r2', name: '最佳闺蜜组：双人护理套餐', energyCost: 0, stock: 20 }
    ]
  }
]

export const getActivityById = (id: string): ActivityItem | undefined => {
  return activities.find(a => a.id === id)
}
