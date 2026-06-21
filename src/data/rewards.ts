import { RewardItem, UserReward } from '@/types'

export const rewards: RewardItem[] = [
  {
    id: '1',
    name: '补水护理券',
    description: '价值298元的深层补水护理一次',
    energyCost: 200,
    type: 'coupon',
    image: 'https://picsum.photos/id/103/300/300',
    stock: 50,
    expiryDate: '2026-12-31'
  },
  {
    id: '2',
    name: '复诊优先服务',
    description: '复诊时优先安排，免排队等待',
    energyCost: 150,
    type: 'service',
    image: 'https://picsum.photos/id/119/300/300',
    stock: 100
  },
  {
    id: '3',
    name: '医用面膜一盒',
    description: '医美专用修复面膜，5片装',
    energyCost: 300,
    type: 'product',
    image: 'https://picsum.photos/id/220/300/300',
    stock: 30,
    expiryDate: '2026-06-30'
  },
  {
    id: '4',
    name: '小气泡清洁护理',
    description: '价值198元的小气泡深层清洁',
    energyCost: 250,
    type: 'coupon',
    image: 'https://picsum.photos/id/225/300/300',
    stock: 40,
    expiryDate: '2026-12-31'
  },
  {
    id: '5',
    name: '皮肤检测服务',
    description: '专业皮肤检测仪全面分析',
    energyCost: 100,
    type: 'service',
    image: 'https://picsum.photos/id/230/300/300',
    stock: 200
  },
  {
    id: '6',
    name: '玻尿酸精华液',
    description: '30ml医美级玻尿酸精华',
    energyCost: 500,
    type: 'product',
    image: 'https://picsum.photos/id/250/300/300',
    stock: 20,
    expiryDate: '2026-08-31'
  },
  {
    id: '7',
    name: 'VIP专属折扣券',
    description: '全场项目8.5折优惠券',
    energyCost: 400,
    type: 'coupon',
    image: 'https://picsum.photos/id/103/300/300',
    stock: 25,
    expiryDate: '2026-12-31'
  },
  {
    id: '8',
    name: '1v1咨询服务',
    description: '资深咨询师30分钟专属咨询',
    energyCost: 180,
    type: 'service',
    image: 'https://picsum.photos/id/119/300/300',
    stock: 80
  }
]

export const userRewards: UserReward[] = [
  {
    id: 'ur1',
    rewardId: '1',
    reward: rewards[0],
    code: 'HF202601001',
    status: 'unused',
    obtainedAt: '2026-06-15'
  },
  {
    id: 'ur2',
    rewardId: '5',
    reward: rewards[4],
    code: 'HF202601002',
    status: 'used',
    obtainedAt: '2026-06-10'
  }
]

export const getRewardById = (id: string): RewardItem | undefined => {
  return rewards.find(r => r.id === id)
}
