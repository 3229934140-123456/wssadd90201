export const generateShareImage = (data: {
  foods: string[]
  day: number
  checkInDays: number
}): string => {
  console.log('[Share] 生成分享图:', data)
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="750" height="1000" viewBox="0 0 750 1000">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF7A9E;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFB6C1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="750" height="1000" fill="url(#bg)"/>
      <circle cx="375" cy="150" r="60" fill="rgba(255,255,255,0.3)"/>
      <text x="375" y="165" text-anchor="middle" fill="white" font-size="40" font-weight="bold">🌍</text>
      <text x="375" y="240" text-anchor="middle" fill="white" font-size="36" font-weight="bold">恢复星球</text>
      <text x="375" y="290" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="28">第 ${data.day} 天 · 已坚持 ${data.checkInDays} 天</text>
      <rect x="50" y="340" width="650" height="${500}" rx="20" fill="rgba(255,255,255,0.95)"/>
      <text x="375" y="400" text-anchor="middle" fill="#1D2129" font-size="32" font-weight="bold">今日合规餐单</text>
      ${data.foods.map((food, index) => `
        <text x="375" y="${470 + index * 60}" text-anchor="middle" fill="#4E5969" font-size="28">✓ ${food}</text>
      `).join('')}
      <text x="375" y="920" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="24">扫码加入恢复星球，一起变美不孤单</text>
      <rect x="315" y="940" width="120" height="40" rx="20" fill="white"/>
      <text x="375" y="965" text-anchor="middle" fill="#FF7A9E" font-size="22" font-weight="bold">长按识别</text>
    </svg>
  `)}`
}

export const generateSupervisorCode = (userId: string): string => {
  const code = btoa(userId + Date.now()).slice(0, 8).toUpperCase()
  console.log('[Share] 生成监督码:', code)
  return code
}

export const getShareText = (data: {
  projectName: string
  day: number
  checkInDays: number
}): string => {
  return `我正在【恢复星球】进行${data.projectName}术后恢复，今天是第${data.day}天，已经坚持了${data.checkInDays}天！一起来打卡，互相监督变美吧~`
}
