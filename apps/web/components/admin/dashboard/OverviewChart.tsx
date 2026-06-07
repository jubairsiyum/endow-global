'use client'

import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', applications: 120 },
  { name: 'Tue', applications: 210 },
  { name: 'Wed', applications: 180 },
  { name: 'Thu', applications: 280 },
  { name: 'Fri', applications: 240 },
  { name: 'Sat', applications: 320 },
]

export default function OverviewChart() {
  return (
    <div className="mt-6 h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />

          <Tooltip />

          <Line type="monotone" dataKey="applications" stroke="#dc2626" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
